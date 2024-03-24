import { Node, NodeInitializer, NodeMessage } from 'node-red';
import { decodeEcoflowMessage, parseProtocol } from './decoder';
import { JoinedState, POWERSTREAM_CONFIG, TimedOutListener } from './state';



function toUint8Array(msg: NodeMessage): Uint8Array|undefined {
  let payload: any = msg.payload;
  if (typeof payload === 'string') {
    payload = Buffer.from(payload, 'base64');
  }
  if (!Buffer.isBuffer(payload)) {
    return;
  }
  return payload;
}

const NODE_TYPE = String('ecoflow-powerstream');

const nodeInit: NodeInitializer = (RED): void => {
  const parser = parseProtocol();
  function EcoflowPowerstreamNode(config: any) {
    /* eslint-disable @typescript-eslint/no-this-alias */
    // @ts-expect-error this is the best way I found to use typescript and Node Red
    const node: Node = this;
    /* eslint-enable @typescript-eslint/no-this-alias */
    RED.nodes.createNode(node, config);
    const timedOutListener: TimedOutListener = (state) => {
      node.send(state.buildMessage());
      node.status({fill: 'red', shape: 'dot', text: 'Timed out'});
    };
    const state = new JoinedState(POWERSTREAM_CONFIG, timedOutListener);
    node.on('input', (msg) => {
      const buffer = toUint8Array(msg);
      if (!buffer) {
        return;
      }
      const topic = msg.topic || '/ecoflow/powerstream';
      let sendJoined = false;
      for (const payload of decodeEcoflowMessage(parser, buffer)) {
        if (state.apply(topic, payload)) {
          sendJoined = true;
        }
        node.send({topic, payload});
      }
      if (sendJoined) {
        const joinedMessage = state.buildMessage();
        if (joinedMessage) {
          node.send(joinedMessage);
          node.status({ fill: 'green', shape: 'dot', text: 'Connected' });
        }
      }
    });
    node.on('close', (done: any) => {
      state.shutdown();
      done();
    });
  }
  RED.nodes.registerType(NODE_TYPE, EcoflowPowerstreamNode);
};

export = nodeInit;

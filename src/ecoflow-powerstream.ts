import { Node, NodeInitializer } from 'node-red';
import { decodeEcoflowMessage, parseProtocol } from './decoder';
import { JoinedState, POWERSTREAM_CONFIG, TimedOutListener } from './state';


function toArrayBuffer(buffer: Buffer) {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i<buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}

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
      if (!Buffer.isBuffer(msg.payload)) {
        return;
      }
      const topic = msg.topic || '/ecoflow/powerstream';
      const buffer = new Uint8Array(toArrayBuffer(msg.payload));
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
  RED.nodes.registerType("ecoflow-powerstream", EcoflowPowerstreamNode);
};

export = nodeInit;

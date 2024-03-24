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
    };
    const state = new JoinedState(POWERSTREAM_CONFIG, timedOutListener);
    node.on('input', (msg) => {
      if (!Buffer.isBuffer(msg.payload)) {
        return;
      }
      const buffer = new Uint8Array(toArrayBuffer(msg.payload));
      let send = false;
      for (const msg of decodeEcoflowMessage(parser, buffer)) {
        if (state.apply('/pferd/heide', msg)) {
          send = true;
        }
      }
      if (send) {
        node.send(msg);
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

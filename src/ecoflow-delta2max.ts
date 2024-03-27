import { Node, NodeInitializer } from 'node-red';
import { IEcoflowMessage } from './decoder';
import { DELTA2MAX_CONFIG, JoinedState, TimedOutListener } from './state';


function getSerial(topic: string): string {
  const found = topic.match(/\/(R[0-9A-Z]{15})(\/.*)?$/);
  if (found && found.length>1) {
    return found[1];
  }
  return '000000000000000';
}

function convertData(params: any): any {
  const ret: any = { };
  if (!params || (typeof params !== 'object')) {
    return ret;
  }
  for (let key of Object.keys(params)) {
    const val = params[key];
    key = key.replace(/\./g, '_');
    if (key === 'bms_kitInfo_watts' && Array.isArray(val)) {
      for (let i=0; i<val.length; i++) {
        const v = val[i]?.curPower;
        if (typeof v === 'number') {
          ret[`${key}${i}`] = v;
        }
      }
      continue;
    }
    const typ = typeof val;
    if (typ === 'number' || typ === 'string') {
      ret[key] = val;
    }
  }
  return ret;
}

const NODE_TYPE = String('ecoflow-delta2max');

const nodeInit: NodeInitializer = (RED): void => {
  function EcoflowDelta2maxNode(config: any) {
    /* eslint-disable @typescript-eslint/no-this-alias */
    // @ts-expect-error this is the best way I found to use typescript and Node Red
    const node: Node = this;
    /* eslint-enable @typescript-eslint/no-this-alias */
    RED.nodes.createNode(node, config);
    const outmsgtype = String(config?.outmsgtype || '');
    const timedOutListener: TimedOutListener = (state) => {
      if (outmsgtype !== 'translated') {
        node.send(state.buildMessage());
      }
      node.status({fill: 'red', shape: 'dot', text: 'Timed out'});
    };
    const state = new JoinedState(DELTA2MAX_CONFIG, timedOutListener);
    node.on('input', (msg) => {
      const inPayload = msg.payload as any;
      if (typeof inPayload !== 'object' || !inPayload?.params) {
        return;
      }
      const topic = msg.topic || '/ecoflow/delta2max';
      let sendJoined = false;
      const payload: IEcoflowMessage = {
        cmdId: inPayload.cmdId || 0,
        cmdFunc: inPayload.cmdFunc || 0,
        msgType: inPayload.moduleType || '0',
        deviceSn: getSerial(topic),
        timestamp: inPayload.timestamp,
        payloadVer: inPayload.version,
        data: convertData(inPayload.params),
      };
      if (state.apply(topic, payload)) {
        sendJoined = true;
      }
      if (outmsgtype !== 'aggregated') {
        node.send({topic, payload});
      }
      if (sendJoined) {
        const joinedMessage = state.buildMessage();
        if (joinedMessage) {
          if (outmsgtype !== 'translated') {
            node.send(joinedMessage);
          }
          node.status({ fill: 'green', shape: 'dot', text: 'Connected' });
        }
      }
    });
    node.on('close', (done: any) => {
      state.shutdown();
      done();
    });
  }
  RED.nodes.registerType(NODE_TYPE, EcoflowDelta2maxNode);
};

export = nodeInit;

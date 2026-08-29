import { Node, NodeInitializer, NodeMessage } from 'node-red';
import { IEcoflowMessage, processEcoflowStreamMessage } from './decoder';
import { DELTA2MAX_CONFIG, IJoinedStateConfig, JoinedState, POWERSTREAM_CONFIG, STREAMS_CONFIG, TimedOutListener } from './state';
import { parseProtocol } from './protocol';



function toUint8Array(msg: NodeMessage): Uint8Array|undefined {
  let payload: any = msg.payload;
  if (typeof payload === 'string') {
    payload = Buffer.from(payload, 'base64');
  }
  if (!Buffer.isBuffer(payload)) {
    return;
  }
  return Uint8Array.from(payload);
}

function getSerialFromTopic(topic: string): string {
  const found = topic.match(/\/(R[0-9A-Z]{15})(\/.*)?$/);
  if (found && found.length>1) {
    return found[1];
  }
  return '000000000000000';
}

function convertDeltaJsonData(params: any): any {
  const ret: any = { };
  if (!params || (typeof params !== 'object')) {
    return ret;
  }
  for (let key of Object.keys(params)) {
    const val = params[key];
    key = key.replace(/\./g, '_');
    if (key === 'bms_kitInfo_watts' && Array.isArray(val)) {
      for (let i=0; i<val.length; i++) {
        let v = val[i]?.curPower;
        if (typeof v === 'number') {
          ret[`${key}${i}`] = v;
        }
        v = val[i]?.f32Soc;
        if (typeof v === 'number') {
          ret[`${key.replace('_watts', '_soc')}${i}`] = v;
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


const NODE_TYPE = String('ecoflow-in');

type DeviceType = 'powerstream' | 'streams' | 'delta2max';
type OutputMessagesType = 'translated' | 'aggregated' | 'both';

function processDelta2MaxMessage(node: Node, state: JoinedState, outmsgtype: OutputMessagesType, msg: NodeMessage): boolean {
  const inPayload = msg.payload as any;
  if (typeof inPayload !== 'object' || !inPayload?.params) {
    return false;
  }
  const topic = msg.topic || '/ecoflow/delta2max';
  let ret = false;
  const payload: IEcoflowMessage = {
    cmdId: inPayload.cmdId || 0,
    cmdFunc: inPayload.cmdFunc || 0,
    msgType: inPayload.moduleType || '0',
    deviceSn: getSerialFromTopic(topic),
    timestamp: inPayload.timestamp,
    payloadVer: inPayload.version,
    data: convertDeltaJsonData(inPayload.params),
  };
  if (state.apply(topic, payload)) {
    ret = true;
  }
  if (outmsgtype !== 'aggregated') {
    node.send({topic, payload});
  }
  return ret;
}

function getStateConfig(devicetype: DeviceType) {
  switch (devicetype) {
    case 'delta2max':
      return DELTA2MAX_CONFIG;
    case 'streams':
      return STREAMS_CONFIG;
    default:
      return POWERSTREAM_CONFIG;
  }
}

const nodeInit: NodeInitializer = (RED): void => {
  const parser = parseProtocol();
  function EcoflowInNode(config: any) {
    /* eslint-disable @typescript-eslint/no-this-alias */
    // @ts-expect-error this is the best way I found to use typescript and Node Red
    const node: Node = this;
    /* eslint-enable @typescript-eslint/no-this-alias */
    RED.nodes.createNode(node, config);
    const outmsgtype = String(config?.outmsgtype || 'both') as OutputMessagesType;
    const devicetype = String(config?.devicetype || 'powerstream') as DeviceType;
    const timeoutFactor = Number(config?.timeoutfactor) || 1;
    const setNodeStatus = (isTimeout: boolean) => {
      node.status({fill: isTimeout ? 'red' : 'green', shape: 'dot', text: isTimeout ? 'Timed out' : 'Connected' });
    }
    node.status({fill: 'yellow', shape: 'dot', text: 'Waiting for complete data set...' });
    const timedOutListener: TimedOutListener = (state, isTimeout: boolean) => {
      if (isTimeout && outmsgtype !== 'translated') {
        node.send(state.buildMessage());
      }
      setNodeStatus(isTimeout);
    };
    const cfg: IJoinedStateConfig = getStateConfig(devicetype);
    const state = new JoinedState(cfg, timeoutFactor, timedOutListener);
    node.on('input', (msg) => {
      let sendJoined: boolean;
      if (devicetype === 'delta2max') {
        sendJoined = processDelta2MaxMessage(node, state, outmsgtype, msg);
      } else {
        const info = processEcoflowStreamMessage(state, parser, msg.topic, toUint8Array(msg));
        sendJoined = info.sendJoined;
        if (outmsgtype !== 'aggregated') {
          for (const payload of info.processedMessages) {
            node.send({ topic: info.topic, payload });
          }
        }
      }
      if (!sendJoined) {
        return;
      }
      const joinedMessage = state.buildMessage();
      if (joinedMessage) {
        if (outmsgtype !== 'translated') {
          node.send(joinedMessage);
        }
        setNodeStatus(Boolean(state.getTimedOutFields()));
      }
    });
    node.on('close', (done: any) => {
      state.shutdown();
      done();
    });
  }
  RED.nodes.registerType(NODE_TYPE, EcoflowInNode);
};

export = nodeInit;

import { Node, NodeInitializer, NodeMessage } from 'node-red';
import { decodeEcoflowMessage, IEcoflowMessage } from './decoder';
import { DELTA2MAX_CONFIG, IJoinedStateConfig, JoinedState, POWERSTREAM_CONFIG, TimedOutListener } from './state';
import { IParserResult } from 'protobufjs';
import { parseProtocol } from './protocol';



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


const NODE_TYPE = String('ecoflow-in');

type DeviceType = 'powerstream' | 'delta2max';
type OutputMessagesType = 'translated' | 'aggregated' | 'both';


function processPowerstreamMessage(node: Node, state: JoinedState, outmsgtype: OutputMessagesType, parser: IParserResult, msg: NodeMessage): boolean {
  const buffer = toUint8Array(msg);
  if (!buffer) {
    return false;
  }
  const topic = msg.topic || '/ecoflow/powerstream';
  let ret = false;
  for (const payload of decodeEcoflowMessage(parser, buffer)) {
    if (state.apply(topic, payload)) {
      ret = true;
    }
    if (outmsgtype !== 'aggregated') {
      node.send({topic, payload});
    }
  }
  return ret;
}

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
    const cfg: IJoinedStateConfig = devicetype === 'delta2max' ? DELTA2MAX_CONFIG : POWERSTREAM_CONFIG;
    const state = new JoinedState(cfg, timedOutListener);
    node.on('input', (msg) => {
      let sendJoined: boolean;
      if (devicetype === 'delta2max') {
        sendJoined = processDelta2MaxMessage(node, state, outmsgtype, msg);
      } else {
        sendJoined = processPowerstreamMessage(node, state, outmsgtype, parser, msg);
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

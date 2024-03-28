import { Node, NodeInitializer, NodeMessage } from 'node-red';
import { encodeSetMessage, parseProtocol } from './decoder';
import { Buffer, IParserResult } from 'protobufjs';



const NODE_TYPE = String('ecoflow-out');

type DeviceType = 'powerstream';

interface IConvertedMessage {
  payload: Buffer,
  method: 'get' | 'set';
}

function processPowerstreamMessage(msg: NodeMessage, parser: IParserResult, config: any): IConvertedMessage|undefined {
  if (!msg.payload || typeof msg.payload !== 'object') {
    return;
  }
  const pl = msg.payload;
  const key = Object.keys(pl)[0];
  if (!key) {
    return;
  }
  let val: any = (pl as any)[key];
  if (typeof val === 'string') {
    val = parseInt(val, 10);
    if (isNaN(val)) {
      return;
    }
  }
  if (typeof val !== 'number') {
    return;
  }
  switch (key) {
    case 'getLatestQuotas':
      return { method: 'get', payload: encodeSetMessage(parser, { src: 32, dest: 32 }) };
    case 'setAcWatts':
      return { method: 'set', payload: encodeSetMessage(parser, {
          pdata: { value: Math.max(1, Math.round(val*10)) },
          src: 32,
          dest: 53,
          dSrc: 1,
          dDest: 1,
          checkType: 3,
          cmdFunc: 20,
          cmdId: 129,
          needAck: 1,
          version: 19,
          payloadVer: 1,
          deviceSn: config.devicesn,
        }) };
    case 'setPrioritizePowerStorage':
      return { method: 'set', payload: encodeSetMessage(parser, {
          pdata: { value: val ? 1 : 0 },
          src: 32,
          dest: 53,
          dSrc: 1,
          dDest: 1,
          checkType: 3,
          cmdFunc: 20,
          cmdId: 130,
          needAck: 1,
          version: 19,
          payloadVer: 1,
          deviceSn: config.devicesn,
        }) };
    case 'ping':
      return { method: 'set', payload: encodeSetMessage(parser, {
          pdata: { value: Math.round(val) },
          src: 32,
          dest: 53,
          dSrc: 1,
          dDest: 1,
          checkType: 3,
          cmdFunc: 32,
          cmdId: 11,
          needAck: 1,
          version: 19,
          payloadVer: 1,
          deviceSn: config.devicesn,
        }) };
  }
}


const nodeInit: NodeInitializer = (RED): void => {
  const parser = parseProtocol();
  function EcoflowOutNode(config: any) {
    /* eslint-disable @typescript-eslint/no-this-alias */
    // @ts-expect-error this is the best way I found to use typescript and Node Red
    const node: Node = this;
    /* eslint-enable @typescript-eslint/no-this-alias */
    RED.nodes.createNode(node, config);
    const devicetype = String(config?.devicetype || 'powerstream') as DeviceType;
    node.on('input', (msg) => {
      let converted: IConvertedMessage | undefined;
      if (devicetype === 'powerstream') {
        converted = processPowerstreamMessage(msg, parser, config || { });
      }
      if (!converted || !config.devicesn) {
        node.status({ fill: 'red', shape: 'dot', text: 'Invalid data received' });
        return;
      }
      const sendmsg: NodeMessage = {
        topic: `/app/${config.userid||'device'}/${config.devicesn}/thing/property/${converted.method}`,
        payload: converted.payload,
      }
      node.send(sendmsg);
      node.status({ fill: 'green', shape: 'dot', text: 'Valid data received' });
    });
    node.on('close', (done: any) => {
      done();
    });
  }
  RED.nodes.registerType(NODE_TYPE, EcoflowOutNode);
};

export = nodeInit;

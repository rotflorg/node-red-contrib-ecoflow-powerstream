import { Node, NodeInitializer, NodeMessage } from 'node-red';
import { parseProtocol } from './protocol';
import { IParserResult } from 'protobufjs';
import {
  encodePowerStreamGetLatestQuotas,
  encodePowerStreamSetAcWatts,
  encodePowerStreamSetPing,
  encodePowerStreamSetPrioritizePowerStorage
} from './encoder';



const NODE_TYPE = String('ecoflow-cmd');

type DeviceType = 'powerstream';

interface IConvertedMessage {
  payload: Buffer,
  method: 'get' | 'set';
}

function processPowerstreamMessage(msg: NodeMessage, parser: IParserResult, deviceSn: string): IConvertedMessage[]|string {
  if (!msg.payload || typeof msg.payload !== 'object') {
    return 'No JSON';
  }
  const pl = msg.payload as any;
  const command = pl.command;
  if (typeof command !== 'string') {
    return 'No command defined';
  }
  let val: any = pl.value;
  if (typeof val === 'string') {
    val = parseInt(val, 10);
    if (isNaN(val)) {
      return 'Invalid value';
    }
  }
  if (typeof val !== 'number') {
    return 'Invalid value type';
  }
  switch (command) {
    case 'heartbeat':
      return [
        { method: 'get', payload: encodePowerStreamGetLatestQuotas(parser) },
        { method: 'set', payload: encodePowerStreamSetPing(parser, 17477, deviceSn) },
      ];
    case 'getLatestQuotas':
      return [{ method: 'get', payload: encodePowerStreamGetLatestQuotas(parser) }];
    case 'setAcWatts':
      if (val<0 || val>800) {
        return `Invalid watts: ${val}`;
      }
      return [{ method: 'set', payload: encodePowerStreamSetAcWatts(parser, val, deviceSn) }];
    case 'setPrioritizePowerStorage':
      return [{ method: 'set', payload: encodePowerStreamSetPrioritizePowerStorage(parser, Boolean(val), deviceSn) }];
    case 'ping':
      return [{ method: 'set', payload: encodePowerStreamSetPing(parser, Math.round(val)%65536, deviceSn) }];
  }
  return `Unknown command ${command}`;
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
      if ((typeof config?.userid !== 'string') || !config.userid) {
        node.status({ fill: 'red', shape: 'dot', text: 'User ID not configured' });
        return;
      }
      let converted: IConvertedMessage[] | string | undefined;
      const deviceSn = (msg.payload as any)?.deviceSn;
      if (typeof deviceSn !== 'string') {
        node.status({ fill: 'red', shape: 'dot', text: 'Missing deviceSn in message' });
        return;
      }
      if (devicetype === 'powerstream') {
        converted = processPowerstreamMessage(msg, parser, deviceSn);
      }
      if (!converted) {
        node.status({ fill: 'red', shape: 'dot', text: 'Invalid device type' });
        return;
      }
      if (typeof converted === 'string') {
        node.status({ fill: 'red', shape: 'dot', text: `Invalid message: ${converted}` });
        return;
      }
      for (const convMsg of converted) {
        const sendmsg: NodeMessage = {
          topic: `/app/${config.userid}/${deviceSn}/thing/property/${convMsg.method}`,
          payload: convMsg.payload,
        }
        node.send(sendmsg);
      }
      node.status({ fill: 'green', shape: 'dot', text: 'Valid data received' });
    });
    node.on('close', (done: any) => {
      done();
    });
  }
  RED.nodes.registerType(NODE_TYPE, EcoflowOutNode);
};

export = nodeInit;

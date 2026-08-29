import { Node, NodeInitializer, NodeMessage } from 'node-red';
import { parseProtocol } from './protocol';
import { IParserResult } from 'protobufjs';
import {
  encodePowerStreamGetLatestQuotas,
  encodePowerStreamSetAcWatts,
  encodePowerStreamSetPing,
  encodePowerStreamSetPrioritizePowerStorage, encodeStreamSeriesGetLatestQuotas, encodeStreamSeriesSetBackupReserve, encodeStreamSeriesSetChargingRange, encodeStreamSeriesSetResidentLoad
} from './encoder';



const NODE_TYPE = String('ecoflow-cmd');

type DeviceType = 'powerstream' | 'streams';

interface IConvertedMessage {
  payload: Buffer,
  method: 'get' | 'set';
}

function getPayloadNumber(pl: any, key: string): number | undefined {
  let ret = pl?.[key];
  if (typeof ret === 'number') {
    return ret;
  }
  if (typeof ret === 'string') {
    ret = parseInt(ret, 10);
    if (isNaN(ret)) {
      return;
    }
    return ret;
  }
}

function processStreamSeriesMessage(msg: NodeMessage, parser: IParserResult, deviceSn: string): IConvertedMessage[]|string {
  if (!msg.payload || typeof msg.payload !== 'object') {
    return 'No JSON';
  }
  const pl = msg.payload as any;
  const command = pl?.command;
  if (typeof command !== 'string') {
    return 'No command defined';
  }
  let val: number | undefined;
  let val2: number | undefined;
  switch (command) {
    case 'heartbeat':
      return [
        { method: 'get', payload: encodeStreamSeriesGetLatestQuotas(parser) },
        { method: 'set', payload: encodePowerStreamSetPing(parser, Math.round(Date.now())%65536, deviceSn) },
      ];
    case 'setBackupReserve':
      val = getPayloadNumber(pl, 'value');
      if ((typeof val !== 'number') || val<0 || val>100) {
        return `Invalid backup reserve percentage: ${val}`;
      }
      return [{ method: 'set', payload: encodeStreamSeriesSetBackupReserve(parser, val, deviceSn) }];
    case 'setChargingRange':
      val = getPayloadNumber(pl, 'min');
      if ((typeof val !== 'number') || val<1 || val>99) {
        return `Invalid minimum charging range percentage: ${val}`;
      }
      val2 = getPayloadNumber(pl, 'max');
      if ((typeof val2 !== 'number') || val2<=val || val2>100) {
        return `Invalid maximum charging range percentage: ${val2}`;
      }
      return [{ method: 'set', payload: encodeStreamSeriesSetChargingRange(parser, val, val2, deviceSn) }];
    case 'setResidentLoad':
      val = getPayloadNumber(pl, 'value');
      if ((typeof val !== 'number') || val<0 || val>800) {
        return `Invalid backup reserve percentage: ${val}`;
      }
      val = Math.round(val / 10) * 10;
      return [{ method: 'set', payload: encodeStreamSeriesSetResidentLoad(parser, [{ startMin: 0, endMin: 1440, loadPower: val }], deviceSn) }];
  }
  return `Unknown command ${command}`;
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
  const val: number | undefined = getPayloadNumber(pl, 'value');
  if (typeof val !== 'number') {
    return 'Invalid value type';
  }
  switch (command) {
    case 'heartbeat':
      return [
        { method: 'get', payload: encodePowerStreamGetLatestQuotas(parser) },
        { method: 'set', payload: encodePowerStreamSetPing(parser, Math.round(val)%65536, deviceSn) },
      ];
    case 'getLatestQuotas':
      return [{ method: 'get', payload: encodePowerStreamGetLatestQuotas(parser) }];
    case 'ping':
      return [{ method: 'set', payload: encodePowerStreamSetPing(parser, Math.round(val)%65536, deviceSn) }];
    case 'setAcWatts':
      if (val<0 || val>800) {
        return `Invalid watts: ${val}`;
      }
      return [{ method: 'set', payload: encodePowerStreamSetAcWatts(parser, val, deviceSn) }];
    case 'setPrioritizePowerStorage':
      return [{ method: 'set', payload: encodePowerStreamSetPrioritizePowerStorage(parser, Boolean(val), deviceSn) }];
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
      switch (devicetype) {
        case 'powerstream':
          converted = processPowerstreamMessage(msg, parser, deviceSn);
          break;
        case 'streams':
          converted = processStreamSeriesMessage(msg, parser, deviceSn);
          break;
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
      if (converted.length) {
        node.status({ fill: 'green', shape: 'dot', text: 'Valid data received' });
      }
    });
    node.on('close', (done: any) => {
      done();
    });
  }
  RED.nodes.registerType(NODE_TYPE, EcoflowOutNode);
};

export = nodeInit;

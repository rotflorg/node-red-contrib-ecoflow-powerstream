import { IParserResult } from 'protobufjs';


interface IResidentLoad {
  startMin: number;
  endMin: number;
  loadPower: number;
}
interface ISendMessage {
  pdata?: {
    value?: number;
    cfgUtcTime?: number;
    cmsMinDsgSoc?: number;
    cmsMaxChgSoc?: number;
    backupReserveSoc?: number;
    dayResidentLoadList?: { load: IResidentLoad[] };
  };
  src: number;
  dest: number;
  dSrc?: number;
  dDest?: number;
  encType?: number;
  checkType?: number;
  cmdFunc?: number;
  cmdId?: number;
  dataLen?: number;
  needAck?: number;
  isAck?: number;
  seq?: number;
  productId?: number;
  version?: number;
  payloadVer?: number;
  timeSnap?: number;
  isRwCmd?: number;
  isQueue?: number;
  ackType?: number;
  code?: string;
  from?: string;
  moduleSn?: string;
  deviceSn?: string;
}

export function encodeSetMessage(parser: IParserResult, msg: ISendMessage): Buffer {
  if (msg.pdata) {
    const setValueType = parser.root.lookupType('SetValue');
    const setValue = setValueType.create(msg.pdata);
    msg.dataLen = Buffer.from(setValueType.encode(setValue).finish()).length;
  }
  if (!msg.seq) {
    msg.seq = Math.floor(Date.now() / 1000);
  }
  if (!msg.from) {
    msg.from = 'ios';
  }
  const setMessageType = parser.root.lookupType('SetMessage');
  const setMessage = setMessageType.create({ header: msg });
  return Buffer.from(setMessageType.encode(setMessage).finish());
}

export function encodePowerStreamGetLatestQuotas(parser: IParserResult): Buffer {
  return encodeSetMessage(parser, { src: 32, dest: 32 });
}

export function encodePowerStreamSetPing(parser: IParserResult, value: number, deviceSn: string): Buffer {
  return encodeSetMessage(parser, {
    pdata: { value },
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
    deviceSn,
  });
}

export function encodePowerStreamSetPrioritizePowerStorage(parser: IParserResult, value: boolean, deviceSn: string): Buffer {
  return encodeSetMessage(parser, {
    pdata: { value: value ? 1 : 0 },
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
    deviceSn,
  });
}

export function encodePowerStreamSetAcWatts(parser: IParserResult, watts: number, deviceSn: string): Buffer {
  return encodeSetMessage(parser, {
    pdata: { value: Math.max(1, Math.round(watts*10)) },
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
    deviceSn,
  });
}

export function encodeStreamSeriesGetLatestQuotas(parser: IParserResult): Buffer {
  return encodeSetMessage(parser, { src: 32, dest: 32, cmdFunc: 20, cmdId: 1 });
}

export function encodeStreamSeriesSetChargingRange(parser: IParserResult, minDsgSoc: number, maxChargeSoc: number, deviceSn: string): Buffer {
  return encodeSetMessage(parser, {
    pdata: { cfgUtcTime: Math.floor(Date.now()/1000), cmsMinDsgSoc: minDsgSoc, cmsMaxChgSoc: maxChargeSoc },
    src: 32,
    dest: 2,
    dSrc: 1,
    dDest: 1,
    cmdFunc: 254,
    cmdId: 17,
    needAck: 1,
    productId: 56,
    version: 3,
    payloadVer: 1,
    deviceSn,
  });
}

export function encodeStreamSeriesSetBackupReserve(parser: IParserResult, soc: number, deviceSn: string): Buffer {
  soc = Math.max(0, Math.min(99, Math.round(soc))) || 0;
  return encodeSetMessage(parser, {
    pdata: { cfgUtcTime: Math.floor(Date.now()/1000), backupReserveSoc: soc },
    src: 32,
    dest: 2,
    dSrc: 1,
    dDest: 1,
    cmdFunc: 254,
    cmdId: 17,
    needAck: 1,
    productId: 56,
    version: 3,
    payloadVer: 1,
    deviceSn,
  });
}

export function encodeStreamSeriesSetResidentLoad(parser: IParserResult, loadList: IResidentLoad[], deviceSn: string): Buffer {
  return encodeSetMessage(parser, {
    pdata: {
      cfgUtcTime: Math.floor(Date.now()/1000),
      // feedGridModePowLimit: powerLimit,
      dayResidentLoadList: { load: loadList },
    },
    src: 32,
    dest: 2,
    dSrc: 1,
    dDest: 1,
    cmdFunc: 254,
    cmdId: 17,
    needAck: 1,
    productId: 56,
    version: 3,
    payloadVer: 1,
    deviceSn,
  });
}

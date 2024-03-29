import { IParserResult } from 'protobufjs';


export interface ISendMessage {
  pdata?: {
    value?: number;
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

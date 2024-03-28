import { IParserResult, parse } from 'protobufjs';
import { IMessageInfo, POWERSTREAM_MESSAGES, PROTOCOL_SOURCE } from './protocol';


export class ParseError extends Error {
  constructor(public errorMessage: string, public msgobj: any) {
    super(errorMessage);
  }
}

export interface IEcoflowMessage {
  cmdId: number;
  cmdFunc: number;
  msgType: string;
  deviceSn: string;
  version?: number;
  timestamp?: number;
  payloadVer: number|string;
  data: any;
}


export function parseProtocol(): IParserResult {
  return parse(PROTOCOL_SOURCE);
}

function decodeMessageInternal(parser: IParserResult, name: string, buffer: Uint8Array): any {
  const messageType = parser.root.lookupType(name);
  const message = messageType.decode(buffer);
  return messageType.toObject(message, { defaults: false });
}

export function decodeEcoflowMessage(parser: IParserResult, buffer: Uint8Array): IEcoflowMessage[] {
  const ret: IEcoflowMessage[] = [];
  const msgobj = decodeMessageInternal(parser, 'Message', buffer);
  if (!Array.isArray(msgobj?.header)) {
    throw new ParseError('no header in message', msgobj);
  }
  for (const header of msgobj.header) {
    if (!header.pdata || !header.cmdId) {
      continue;
    }
    const messageInfo: IMessageInfo = POWERSTREAM_MESSAGES[String(header.cmdId)];
    if (!messageInfo || (messageInfo.cmdFunc && messageInfo.cmdFunc!==header.cmdFunc)) {
      continue;
    }
    if (messageInfo.ignore) {
      continue;
    }
    const data = decodeMessageInternal(parser, messageInfo.name, header.pdata);
    ret.push({
      cmdId: header.cmdId,
      cmdFunc: header.cmdFunc || 0,
      msgType: messageInfo.key || messageInfo.name,
      deviceSn: header.deviceSn,
      version: header.version || 0,
      payloadVer: header.payloadVer || 0,
      data,
    });
  }
  return ret;
}

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

export function encodeSetMessage(parser: IParserResult, msg: ISendMessage): Uint8Array {
  if (msg.pdata) {
    if (msg.pdata.value===0) {
      delete msg.pdata.value;
    }
    let value = msg.pdata.value || 0;
    msg.dataLen = 2;
    while (value>=128) {
      msg.dataLen++;
      value >>= 7;
    }
  }
  if (!msg.seq) {
    msg.seq = Math.floor(Date.now() / 1000);
  }
  if (!msg.from) {
    msg.from = 'ios';
  }
  const setMessageType = parser.root.lookupType('SetMessage');
  const setMessage = setMessageType.create({ header: msg });
  return setMessageType.encode(setMessage).finish();
}

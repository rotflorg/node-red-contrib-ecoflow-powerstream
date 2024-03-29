import { IParserResult } from 'protobufjs';


export interface IMessageInfo {
  name: string;
  key?: string;
  ignore?: boolean;
  cmdFunc?: number;
}

export const POWERSTREAM_MESSAGES: {[cmdId: string]: IMessageInfo} = {
  '1': { name: 'InverterHeartbeat', cmdFunc: 20 },
  '4': { name: 'InverterHeartbeat2', cmdFunc: 20, },
  '32': { name: 'PowerPack', cmdFunc: 254, ignore: true },
  '134': { name: 'TimeTaskConfig', cmdFunc: 20, ignore: true },
  '136': { name: 'PowerPack', cmdFunc: 20, ignore: true },
  '138': { name: 'PowerPack', cmdFunc: 20, ignore: true },
};

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

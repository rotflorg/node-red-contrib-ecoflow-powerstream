import { IEcoflowMessage } from './decoder';
import { NodeMessage } from 'node-red';


export interface IFieldConfigValue {
  name: string;
  outputName?: string;
  undefValue: number;
  timeoutMs: number;
  formatFn?: (input: number) => number;
  required?: boolean;
  requiredComputeBase?: boolean;
  initChange?: boolean;
}

export interface IFieldConfigCompute {
  name: string;
  computeFn: (payload: any) => number|string;
  required?: boolean;
}

export interface IJoinedStateConfig {
  mainTimeoutMs: number;
  values: IFieldConfigValue[];
  compute: IFieldConfigCompute[];
}

export interface IFieldState {
  lastupMs: number;
  available: boolean;
  timeout: boolean;
  value: number;
  config: IFieldConfigValue;
}

function formatDigit(input: number): number {
  return input / 10;
}
function formatCents(input: number): number {
  return input / 100;
}
function formatMillis(input: number): number {
  return input / 1000;
}
function formatInt(input: number): number {
  return Math.round(input);
}

export const STREAMS_CONFIG: IJoinedStateConfig = {
  mainTimeoutMs: 240000,
  values: [
    { name: 'soc', undefValue: 0, timeoutMs: 5400000, initChange: true, requiredComputeBase: true },
    { name: 'powGetBpCms', undefValue: 0, timeoutMs: 900000, outputName: 'batInputWatts' },
    { name: 'powGetPv', undefValue: 0, formatFn: formatInt, timeoutMs: 300000, initChange: true, outputName: 'pv1InputWatts' },
    { name: 'powGetPv2', undefValue: 0, formatFn: formatInt, timeoutMs: 300000, initChange: true, outputName: 'pv2InputWatts' },
    { name: 'powGetPv3', undefValue: 0, formatFn: formatInt, timeoutMs: 300000, initChange: true, outputName: 'pv3InputWatts' },
    { name: 'powGetPv4', undefValue: 0, formatFn: formatInt, timeoutMs: 300000, initChange: true, outputName: 'pv4InputWatts' },
    { name: 'gridConnectionPower', undefValue: 0, formatFn: formatInt, timeoutMs: 900000, outputName: 'gridWatt' },
    { name: 'inputWatts', undefValue: 0, timeoutMs: 900000 },
    { name: 'outputWatts', undefValue: 0, timeoutMs: 900000 },
    { name: 'v1p0_lcdShowSoc', undefValue: 0, timeoutMs: 900000, requiredComputeBase: true },
    { name: 'v1p0_f32LcdShowSoc', undefValue: 0, formatFn: formatInt, timeoutMs: 900000, requiredComputeBase: true },
    { name: 'powGetPvSum', undefValue: 0, timeoutMs: 900000 },
    { name: 'soh', undefValue: 0, timeoutMs: 900000 },
    { name: 'cycles', undefValue: 0, timeoutMs: 900000 },
    { name: 'temp', undefValue: 0, timeoutMs: 900000 },
    { name: 'minDsgSoc', undefValue: 0, timeoutMs: 900000 },
    { name: 'maxChargeSoc', undefValue: 100, timeoutMs: 900000 },
  ],
  compute: [
    { name: 'pvInputWatts', computeFn: (payload: any): number => {
        return payload.powGetPvSum || Math.round(((payload.powGetPv || 0) + (payload.powGetPv2 || 0) + (payload.powGetPv3 || 0) + (payload.powGetPv4 || 0)) * 0.97);
      }},
    { name: 'batSoc', required: true, computeFn: (payload: any): number => {
        return payload.soc || payload.v1p0_lcdShowSoc || Math.round(payload.v1p0_f32LcdShowSoc || 0);
      }},
  ]
};

export const POWERSTREAM_CONFIG: IJoinedStateConfig = {
  mainTimeoutMs: 240000,
  values: [
    { name: 'batInputVolt', undefValue: 0, formatFn: formatDigit, timeoutMs: 900000 },
    { name: 'batSoc', undefValue: 0, timeoutMs: 5400000, initChange: true },
    { name: 'batInputWatts', undefValue: 0, formatFn: formatDigit, timeoutMs: 900000 },
    { name: 'invOutputWatts', undefValue: 0, formatFn: formatDigit, timeoutMs: 600000, initChange: true },
    { name: 'pv1InputWatts', undefValue: 0, formatFn: formatDigit, timeoutMs: 300000, initChange: true },
    { name: 'pv2InputWatts', undefValue: 0, formatFn: formatDigit, timeoutMs: 300000, initChange: true },
    { name: 'pv1OpVolt', outputName: 'pv1InputVolt', undefValue: 0, formatFn: formatCents, timeoutMs: 300000 },
    { name: 'pv2OpVolt', outputName: 'pv2InputVolt', undefValue: 0, formatFn: formatCents, timeoutMs: 300000 },
    { name: 'supplyPriority', undefValue: 0, timeoutMs: 900000 },
    { name: 'invStatus', undefValue: 0, timeoutMs: 900000 },
    { name: 'gridWatt_45', undefValue: 0, formatFn: formatDigit, timeoutMs: 900000, outputName: 'gridWatt' },
  ],
  compute: [
    { name: 'pvInputWatts', computeFn: (payload: any): number => {
      return Math.round(((payload.pv1InputWatts || 0) + (payload.pv2InputWatts || 0)) * 9.7) / 10;
      }},
  ]
};

export const DELTA2MAX_CONFIG: IJoinedStateConfig = {
  mainTimeoutMs: 240000,
  values: [
    { name: 'bms_emsStatus_f32LcdShowSoc', undefValue: 0, timeoutMs: 14400000, required: true },
    { name: 'bms_emsStatus_maxChargeSoc', undefValue: 0, timeoutMs: 14400000 },
    { name: 'bms_emsStatus_minDsgSoc', undefValue: 0, timeoutMs: 14400000 },
    { name: 'bms_bmsStatus_f32ShowSoc', undefValue: 0, timeoutMs: 14400000 },
    { name: 'bms_bmsStatus_vol', undefValue: 0, formatFn: formatMillis, timeoutMs: 14400000 },
    { name: 'bms_slave_bmsSlaveStatus_1_f32ShowSoc', undefValue: 0, timeoutMs: 14400000 },
    { name: 'bms_slave_bmsSlaveStatus_1_vol', undefValue: 0, formatFn: formatMillis, timeoutMs: 14400000 },
    { name: 'bms_slave_bmsSlaveStatus_2_f32ShowSoc', undefValue: 0, timeoutMs: 14400000 },
    { name: 'bms_slave_bmsSlaveStatus_2_vol', undefValue: 0, formatFn: formatMillis, timeoutMs: 14400000 },
    { name: 'bms_bmsInfo_bsmCycles', undefValue: 0, timeoutMs: 14400000 },
    { name: 'bms_bmsInfo_soh', undefValue: 0, timeoutMs: 14400000 },
    { name: 'bms_kitInfo_watts0', undefValue: 0, timeoutMs: 600000 },
    { name: 'bms_kitInfo_watts1', undefValue: 0, timeoutMs: 600000 },
    { name: 'bms_kitInfo_soc0', undefValue: 0, timeoutMs: 600000 },
    { name: 'bms_kitInfo_soc1', undefValue: 0, timeoutMs: 600000 },
    { name: 'mppt_inWatts', undefValue: 0, timeoutMs: 900000 },
    { name: 'mppt_pv2InWatts', undefValue: 0, timeoutMs: 900000 },
    { name: 'inv_inputWatts', undefValue: 0, timeoutMs: 600000 },
    { name: 'inv_outputWatts', undefValue: 0, timeoutMs: 600000 },
    { name: 'pd_XT150Watts1', undefValue: 0, timeoutMs: 600000 },
    { name: 'pd_wattsOutSum', undefValue: 0, timeoutMs: 600000 },
  ],
  compute: [
    { name: 'mppt_pvInputWatts', computeFn: (payload: any): number => {
        return Math.floor(((payload.mppt_inWatts || 0) + (payload.mppt_pv2InWatts || 0)));
      }},
    { name: 'bms_soc', computeFn: (payload: any): number => {
        let val = payload.bms_emsStatus_f32LcdShowSoc;
        if (val && (typeof val === 'number')) {
          return val;
        }
        val = 0;
        let count = 0;
        const vals = [
          payload.bms_bmsStatus_f32ShowSoc,
          payload.bms_slave_bmsSlaveStatus_1_f32ShowSoc,
          payload.bms_slave_bmsSlaveStatus_2_f32ShowSoc
        ];
        for (const chk of vals) {
          if (typeof chk === 'number') {
            val += chk;
            count++;
          }
        }
        return Math.round(val * 10 / Math.max(1, count)) / 10;
      }},
  ]
};



export type TimedOutListener = (state: JoinedState, isTimeout: boolean) => void;

export class JoinedState {
  private readonly fields: {[name: string]: IFieldState} = { };
  private createTimeMs: number = 0;
  private deviceSn: string | undefined;
  private topic: string = '';
  private ready: boolean = false;
  private lastHeartbeat: number = 0;
  private timer: NodeJS.Timeout|undefined;
  private isShutdown: boolean = false;

  public constructor(private readonly jjconfig: IJoinedStateConfig, private readonly timeoutFactor?: number, private readonly timedOutListener?: TimedOutListener) {
    this.reset();
  }

  public apply(topic: string, msg: IEcoflowMessage): boolean {
    if (!topic) {
      return false;
    }
    if (this.isShutdown) {
      this.reset();
    }
    const now = (new Date()).getTime();
    this.lastHeartbeat = now;
    let changed = false;
    if (!this.topic) {
      this.topic = topic;
      this.deviceSn = msg.deviceSn;
      if (!this.deviceSn) {
        const t = topic.split('/');
        this.deviceSn = t[t.length - 1];
      }
      let anyRequired = false;
      for (const config of this.jjconfig.values) {
        anyRequired ||= Boolean(config.required || config.requiredComputeBase);
      }
      if (!anyRequired) {
        changed = true;
      }
    }
    for (const key of Object.keys(msg.data)) {
      const value = msg.data[key];
      if ((typeof value) === 'number') {
        if (this.storeState(key, value, now)) {
          changed = true;
        }
      } else if ((typeof value) === 'object' && value && !Array.isArray(value)) {
        for (const skey of Object.keys(value)) {
          const svalue = value[skey];
          if ((typeof svalue) === 'number') {
            if (this.storeState(`${key}_${skey}`, svalue, now)) {
              changed = true;
            }
          }
        }
      }
    }
    if (changed) {
      this.checkReady();
      if (!this.timer && this.ready && this.timedOutListener) {
        this.startIntervalTimer();
      }
    }
    return changed;
  }
  private storeState(key: string, value: number, now: number): boolean {
    const state = this.fields[key];
    if (!state) {
      return false;
    }
    const valueChanged = state.value !== value || (!state.available|| state.timeout);
    state.value = value;
    state.lastupMs = now;
    state.timeout = false;
    state.available = true;
    return Boolean(state.config.required || state.config.requiredComputeBase || (state.config.initChange && valueChanged));
  }
  public buildMessage(): NodeMessage|undefined {
    if (!this.ready) {
      return;
    }
    return {
      topic: `${this.topic}/aggregated`,
      payload: { deviceSn: this.deviceSn, ...this.buildPayload() },
    } as NodeMessage;
  }
  public buildPayload(): {[key: string]: string|number} {
    const ret: {[key: string]: string|number} = { };
    for (const val of Object.values(this.fields)) {
      if (!val.available) {
        continue;
      }
      ret[val.config.outputName ?? val.config.name] = val.config.formatFn ? val.config.formatFn(val.value) : val.value;
    }
    for (const config of this.jjconfig.compute) {
      ret[config.name] = config.computeFn(ret);
    }
    return ret;
  }
  public shutdown(): void {
    this.isShutdown = true;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
  public getTimedOutFields(): string {
    let ret = '';
    for (const val of Object.values(this.fields)) {
      if (val.timeout && val.config.required) {
        const name = val.config.name;
        ret = ret ? `${ret},${name}` : name;
      }
    }
    return ret;
  }
  private reset(): void {
    this.createTimeMs = new Date().getTime();
    this.deviceSn = undefined;
    this.topic = '';
    this.ready = false;
    this.isShutdown = false;
    for (const config of this.jjconfig.values) {
      this.fields[config.name] = { lastupMs: 0, available: false, timeout: false, value: config.undefValue, config };
    }
  }
  private checkReady(): boolean {
    let ready = Boolean(this.topic && this.deviceSn);
    let changed = false;
    const now = new Date().getTime();
    const timeoutFactor = Math.max(0.5, (this.timeoutFactor || 1));
    const mainTimeoutMs = this.jjconfig.mainTimeoutMs*timeoutFactor;
    for (const val of Object.values(this.fields)) {
      if (!val.available && val.config.required) {
        if (this.createTimeMs+mainTimeoutMs < now) {
          val.available = true;
          changed = true;
        } else {
          ready = false;
        }
      } else if (val.lastupMs && (val.lastupMs+(val.config.timeoutMs*timeoutFactor) < now || (this.lastHeartbeat+mainTimeoutMs < now))) {
        val.lastupMs = 0;
        val.timeout = true;
        val.value = val.config.undefValue;
        changed = true;
      }
    }
    if (ready && !this.ready) {
      const payload = this.buildPayload();
      for (const config of this.jjconfig.compute) {
        if (config.required && !config.computeFn(payload)) {
          ready = false;
        }
      }
      if (ready) {
        changed = true;
      }
    }
    this.ready = ready;
    return changed;
  }
  private startIntervalTimer(): void {
    if (this.timer || this.isShutdown) {
      return;
    }
    let lastTimeout = '';
    const timer = setInterval(() => {
      if (this.isShutdown) {
        clearInterval(timer);
        if (this.timer===timer) {
          this.timer = undefined;
        }
        return;
      }
      if (!this.checkReady()) {
        return;
      }
      if (this.ready) {
        const newTimeout = this.getTimedOutFields();
        if (lastTimeout !== newTimeout) {
          lastTimeout = newTimeout;
          this.timedOutListener?.(this, Boolean(newTimeout));
        }
      }
    }, 5000);
    this.timer = timer;
  }
}

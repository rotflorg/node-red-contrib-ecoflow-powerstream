import { IEcoflowMessage } from './decoder';
import { NodeMessage } from 'node-red';


export interface IFieldConfigValue {
  name: string;
  outputName?: string;
  undefValue: number;
  timeoutMs: number;
  formatFn?: (input: number) => number;
  required?: boolean;
}

export interface IFieldConfigCompute {
  name: string;
  computeFn: (payload: any) => number|string;
}

export interface IJoinedStateConfig {
  values: IFieldConfigValue[];
  compute: IFieldConfigCompute[];
}

export interface IFieldState {
  lastupMs: number;
  available: boolean;
  value: number;
  config: IFieldConfigValue;
}

function formatDigit(input: number): number {
  return input / 10;
}
function formatMillis(input: number): number {
  return input / 1000;
}

export const POWERSTREAM_CONFIG: IJoinedStateConfig = {
  values: [
    { name: 'batInputVolt', undefValue: 0, formatFn: formatDigit, timeoutMs: 60000, required: true },
    { name: 'batSoc', undefValue: 0, timeoutMs: 600000 },
    { name: 'batInputWatts', undefValue: 0, formatFn: formatDigit, timeoutMs: 60000, required: true },
    { name: 'invOutputWatts', undefValue: 0, formatFn: formatDigit, timeoutMs: 60000, required: true },
    { name: 'pv1InputWatts', undefValue: 0, formatFn: formatDigit, timeoutMs: 60000, required: true },
    { name: 'pv2InputWatts', undefValue: 0, formatFn: formatDigit, timeoutMs: 60000, required: true },
    { name: 'pv1OpVolt', outputName: 'pv1InputVolt', undefValue: 0, formatFn: formatDigit, timeoutMs: 30000 },
    { name: 'pv2OpVolt', outputName: 'pv2InputVolt', undefValue: 0, formatFn: formatDigit, timeoutMs: 30000 },
  ],
  compute: [
    { name: 'pvInputWatts', computeFn: (payload: any): number => {
      return Math.round(((payload.pv1InputWatts || 0) + (payload.pv2InputWatts || 0)) * 9.7) / 10;
      }}
  ]
};

export const DELTA2MAX_CONFIG: IJoinedStateConfig = {
  values: [
    { name: 'bms_emsStatus_f32LcdShowSoc', undefValue: 0, timeoutMs: 60000, required: true },
    { name: 'bms_bmsStatus_f32ShowSoc', undefValue: 0, timeoutMs: 60000, required: true },
    { name: 'bms_bmsStatus_vol', undefValue: 0, formatFn: formatMillis, timeoutMs: 60000 },
    { name: 'bms_kitInfo_watts0', undefValue: 0, timeoutMs: 60000 },
    { name: 'bms_kitInfo_watts1', undefValue: 0, timeoutMs: 60000 },
    { name: 'mppt_inWatts', undefValue: 0, timeoutMs: 60000 },
    { name: 'mppt_pv2InWatts', undefValue: 0, timeoutMs: 60000 },
    { name: 'inv_inputWatts', undefValue: 0, timeoutMs: 60000 },
    { name: 'inv_outputWatts', undefValue: 0, timeoutMs: 60000 },
  ],
  compute: [
    { name: 'mppt_pvInputWatts', computeFn: (payload: any): number => {
        return Math.floor(((payload.mppt_inWatts || 0) + (payload.mppt_pv2InWatts || 0)));
      }}
  ]
};



export type TimedOutListener = (state: JoinedState) => void;

export class JoinedState {
  private readonly fields: {[name: string]: IFieldState} = { };
  private createTimeMs: number = 0;
  private deviceSn: string = '';
  private topic: string = '';
  private ready: boolean = false;
  private timer: NodeJS.Timeout|undefined;
  private isShutdown: boolean = false;
  public constructor(private readonly jjconfig: IJoinedStateConfig, private readonly timedOutListener?: TimedOutListener) {
    this.reset();
  }
  public apply(topic: string, msg: IEcoflowMessage): boolean {
    if (!topic || !msg.deviceSn) {
      return false;
    }
    if (this.isShutdown) {
      this.reset();
    }
    let changed = false;
    if (!this.topic) {
      this.topic = topic;
      this.deviceSn = msg.deviceSn;
      let anyRequired = false;
      for (const config of this.jjconfig.values) {
        anyRequired ||= Boolean(config.required);
      }
      if (!anyRequired) {
        changed = true;
      }
    }
    for (const key of Object.keys(msg.data)) {
      const state = this.fields[key];
      if (!state) {
        continue;
      }
      state.value = msg.data[key];
      state.lastupMs = (new Date()).getTime();
      state.available = true;
      if (state.config.required) {
        changed = true;
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
  public buildMessage(): NodeMessage|undefined {
    if (!this.ready) {
      return;
    }
    const payload: {[key: string]: string|number} = { };
    for (const val of Object.values(this.fields)) {
      if (!val.available) {
        continue;
      }
      payload[val.config.name] = val.config.formatFn ? val.config.formatFn(val.value) : val.value;
    }
    for (const config of this.jjconfig.compute) {
      payload[config.name] = config.computeFn(payload);
    }
    return {
      topic: `${this.topic}/aggregated`,
      payload: { deviceSn: this.deviceSn, ...payload },
    } as NodeMessage;
  }
  public shutdown(): void {
    this.isShutdown = true;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
  private reset(): void {
    this.createTimeMs = new Date().getTime();
    this.deviceSn = '';
    this.topic = '';
    this.ready = false;
    this.isShutdown = false;
    for (const config of this.jjconfig.values) {
      this.fields[config.name] = { lastupMs: 0, available: false, value: config.undefValue, config };
    }
  }
  private checkReady(): boolean {
    let ready = Boolean(this.topic && this.deviceSn);
    let changed = false;
    const now = new Date().getTime();
    for (const val of Object.values(this.fields)) {
      if (!val.available && val.config.required) {
        if (this.createTimeMs+val.config.timeoutMs < now) {
          val.available = true;
          changed = true;
        } else {
          ready = false;
        }
      } else if (val.lastupMs && val.lastupMs+val.config.timeoutMs < now) {
        val.lastupMs = 0;
        val.value = val.config.undefValue;
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
        this.timedOutListener?.(this);
      }
    }, 5000);
    this.timer = timer;
  }
}

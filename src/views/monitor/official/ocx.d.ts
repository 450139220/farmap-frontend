declare global {
  interface Window {
    WebControl: {
      new (options: any): WebControlInstance;
      (options: any): WebControlInstance; // 允许函数调用
    };
  }
}
interface WebControlInstance {
  JS_StartService(type: string, options: any): Promise<void>;
  JS_CreateWnd(el: string, width: number, height: number, options: any): Promise<void>;
  JS_Resize(width: number, height: number): void;
  JS_SetWindowControlCallback(options: any): void;
  JS_RequestInterface(params: any): Promise<any>;
  JS_CuttingPartWindow(left: number, top: number, width: number, height: number): void;
  JS_RepairPartWindow(left: number, top: number, width: number, height: number): void;
  JS_Disconnect(): Promise<void>;
  JS_DestroyWnd(): Promise<void>;
  JS_StopService(type: string): Promise<void>;
}

// 定义 Ocx 类的构造函数选项
export interface OcxOptions {
  el?: string;
  width?: number;
  height?: number;
  autoLoad?: boolean;
  iServicePortStart?: number;
  iServicePortEnd?: number;
  szClassId?: string;
  dllPath?: string;
  success?: () => void;
  error?: () => void;
  callback?: (data: any, ocx: Ocx) => void;
  afterCreateWnd?: (ocx: Ocx) => void;
}

declare class Ocx {
  // 属性
  el: string;
  width: number;
  height: number;
  oWebControl: WebControlInstance | null;
  options: OcxOptions;

  constructor(options: OcxOptions);

  run(autoCreateWnd?: boolean): Promise<void>;
  sendCommonParams(funcName: string, params: any): void;
  createWnd(options?: any): Promise<void>;
  clientResize(funcName: string, width: number, height: number): void;
  request(params: { funcName: string; arguments: any }): Promise<any>;
  callback(cb: (data: any, ocx: Ocx) => void): void;
  cut(left?: number, top?: number, width?: number, height?: number): void;
  repair(left?: number, top?: number, width?: number, height?: number): void;
  close(success?: () => void, error?: () => void): void;
  resize(): void;
  wakeUp(path: string): void;

  _setWndCover(): void;
}

export default Ocx;

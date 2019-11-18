export type messageCb = (data: { event: string; message: string }) => void;
export type errorCb = (err: Error) => void;

export type IOptions = {
  reconnect?: boolean;
  backoffOptions?: any;
};

export type ISSEOptions = {
  headers?: Object;
  proxy?: string;
  https?: Object;
  withCredentials?: Boolean;
  forceXhr?: Boolean;
  queryParams?: Object;
};

export default interface IClient {
  start(options?: ISSEOptions): any;

  stop(): any;

  restart(): any;

  isConnected(): boolean;

  setQueryParams(params: Object): any;

  onMessage(cb: messageCb): any;

  onError(cb: errorCb): any;
}

export class ClientError extends Error {
  public status: number;
  public reason: string;

  constructor(message: string, reason: string, status: number = -1) {
    super(message);
    this.reason = reason;
    this.status = status;
  }
}

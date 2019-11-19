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

  addQueryParams(params: Object): any;

  addEvent(evnet: string, params?: Object): any;

  removeEvent(evnet: string): any;
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

import Client from './client';
import { IOptions, ISSEOptions, ClientError } from './IClient';

export function client(url: string, events: string[], options?: IOptions) {
  return new Client(url, events, options);
}
export { IOptions, ISSEOptions, ClientError };

import { EventEmitter } from 'eventemitter3';
import * as qs from 'query-string';
import * as uuid from 'uuid';
import _debug from 'debug';

import EventSource = require('shimo-eventsource');
import lodashAssign = require('lodash.assign');
import Backoff = require('backo2');

import IClient, {
  IOptions,
  ISSEOptions,
  messageCb,
  errorCb,
  ClientError,
} from './IClient';

const debug = _debug('sse-io-client');

const EVENT = {
  MESSAGE: 'message',
  ERROR: 'error',
  OFFLINE: 'offline',
  DISCONNECT: 'disconnect',
};

const DEFAULT_BACKOFF_OPTIONS = {
  min: 100,
  max: 5000,
  jitter: 0.5,
};

export default class Client extends EventEmitter implements IClient {
  private url: string;
  private clientId: string;
  private events: string[];
  private eventSource?: EventSource;
  private sseOptions?: ISSEOptions;
  private backoff: Backoff;
  private backoffRunTimer: any;
  // auto reconnect
  private reconnect: boolean = true;
  private stopped: boolean = false;

  constructor(url: string, events: string[], options?: IOptions) {
    super();
    this.url = url;
    this.events = events;
    this.clientId = uuid.v4().toString();

    if (options) {
      if (options.hasOwnProperty('reconnect')) {
        this.reconnect = !!options.reconnect;
      }
    }

    this.backoff = new Backoff(
      lodashAssign(DEFAULT_BACKOFF_OPTIONS, options && options.backoffOptions)
    );
  }

  public start(options?: ISSEOptions) {
    this.stopped = false;
    this.sseOptions = options;
    this.pull();
  }

  public stop() {
    if (!this.stopped) {
      if (this.eventSource) {
        this.eventSource.close();
      }
      this.stopped = true;
    }
  }

  public onMessage(cb: messageCb) {
    this.on(EVENT.MESSAGE, cb);
  }

  public onError(cb: errorCb) {
    this.on(EVENT.ERROR, cb);
  }

  private pull() {
    if (this.stopped) {
      return;
    }
    const url = this.genEventSourceUrl();
    const eventSource: EventSource = (this.eventSource = new EventSource(
      url,
      this.sseOptions
    ));

    for (const event of this.events) {
      eventSource.addEventListener(event, (e: any) => {
        this.emit(EVENT.MESSAGE, {
          event,
          message: e.data,
        });
      });
    }

    eventSource.onerror = (error: any) => {
      this.onEventSourceErrorOrClose(error);
    };
    eventSource.addEventListener('close', (error: any) => {
      this.onEventSourceErrorOrClose(error);
    });
  }

  private genEventSourceUrl() {
    const [baseUrl, queryString] = this.url.split('?');
    const parsed = qs.parse(queryString);

    lodashAssign(
      parsed,
      {
        clientId: this.clientId,
        events: this.events,
      },
      this.sseOptions && this.sseOptions.queryParams
    );

    return `${baseUrl}?${qs.stringify(parsed)}`;
  }

  private onEventSourceErrorOrClose(error: any) {
    if (this.eventSource) {
      try {
        this.eventSource.close();
        this.eventSource.removeEventListener('close');
        for (const event of this.events) {
          this.eventSource.removeEventListener(event);
        }
      } catch (e) {
        debug('event source closed error', e);
      }
    }

    const status = String(error.status);
    // offline
    if (status === '' || status === '0') {
      this.emit(EVENT.ERROR, new ClientError(error.message, 'client offline'));
      this.delayPull(status);
      return;
    }

    if (status[0] === '2') {
      this.backoff.reset();
      this.reconnect && this.pull();
      return;
    }

    this.emit(
      EVENT.ERROR,
      new ClientError(error.message, 'http error', error.status)
    );
    if (status[0] === '4') {
      return;
    }
    // should reconnect when receive 5xx http status
    this.reconnect && this.delayPull(status);
  }

  private delayPull(status: string) {
    const delay = this.backoff.duration();
    debug(`pull with status ${status}, delay ${delay}ms to reconnect`);
    if (this.backoffRunTimer) {
      clearTimeout(this.backoffRunTimer);
    }

    this.backoffRunTimer = setTimeout(() => this.pull(), delay);
  }
}

import { EventEmitter } from 'eventemitter3';
import * as qs from 'query-string';
import * as uuid from 'uuid';
import _debug from 'debug';

import EventSource = require('shimo-eventsource');
import lodashAssign = require('lodash.assign');
import Backoff = require('backo2');

import { isObject, debounce } from './helpers';

import IClient, { IOptions, ISSEOptions, ClientError } from './IClient';

const debug = _debug('sse-io-client');

export const EVENTS = {
  MESSAGE: 'message',
  ERROR: 'error',
  CONNECTED: 'connected',
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
  private connected: boolean = false;

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
    if (options) {
      this.sseOptions = options;
    }
    this.pull();
  }

  public stop() {
    if (!this.stopped) {
      if (this.eventSource) {
        this.eventSource.close();
      }
      this.stopped = true;
      this.emit(EVENTS.DISCONNECT);
    }
  }

  public addEvent(event: string, params?: Object) {
    if (this.events.length > 0 && !this.events.includes(event)) {
      this.events.push(event);
    }

    if (params) {
      this.addQueryParams(params);
    }

    debounce(() => this.restart, 100);
  }

  public removeEvent(event: string, params?: Object) {
    if (this.events.length > 0) {
      const idx = this.events.indexOf(event);
      if (idx > -1) {
        this.events.splice(idx, 1);
      }
    }

    if (params) {
      this.addQueryParams(params);
    }

    debounce(() => this.restart, 100);
  }

  public addQueryParams(params: Object): any {
    if (!isObject(params)) {
      throw new Error('params should be an object!');
    }

    if (this.sseOptions) {
      this.sseOptions.queryParams = lodashAssign(
        this.sseOptions.queryParams,
        params
      );
    } else {
      this.sseOptions = {
        queryParams: params,
      };
    }

    return this.sseOptions.queryParams;
  }

  public restart(): void {
    this.stop();
    this.start();
  }

  public isConnected(): boolean {
    return this.connected;
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
        this.emit(EVENTS.MESSAGE, {
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

    this.connected = true;
    this.emit(EVENTS.CONNECTED);
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
    this.connected = false;
    this.emit(EVENTS.DISCONNECT);

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
      this.emit(
        EVENTS.ERROR,
        new ClientError(error.message, `can't connect to server`)
      );
      this.delayPull(status);
      return;
    }

    if (status[0] === '2') {
      this.backoff.reset();
      this.reconnect && this.pull();
      return;
    }

    this.emit(
      EVENTS.ERROR,
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

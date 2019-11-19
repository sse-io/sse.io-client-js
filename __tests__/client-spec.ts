import Client, { EVENTS as CEVENTS } from '../src/client';
import { BASE_URL } from './helpers/constants';
import { EVENTS, EVENT_DATA } from './helpers/mock_data';

const bluebird = require('bluebird');

function newClient(events: string[], options?: any) {
  return new Client(`${BASE_URL}/files/guid/pull`, events, options);
}

describe('sse-io client', () => {
  test('should get response from single event', async () => {
    const event = EVENTS.TEST_NORMAL;
    const client = newClient([event]);
    const promise = newEventPromise(client, event);

    client.start();
    await promise;
    client.stop();
  });

  test('should emit error event when receive 4xx or 5xx http status', async () => {
    const event = EVENTS.TEST_NORMAL;
    const client = newClient([event]);
    const badHttpStatus = [400, 401, 403, 500, 503];
    const status =
      badHttpStatus[Math.floor(Math.random() * badHttpStatus.length)];

    const promise = new Promise(resolve => {
      client.on(CEVENTS.ERROR, (err: any) => {
        expect(err.status).toBe(status);
        resolve();
      });
    });

    client.start({
      queryParams: {
        resStatus: status,
      },
    });
    await promise;
    client.stop();
  });

  test('should auto reconnect when receive 5xx http status', async () => {
    const event = EVENTS.TEST_NORMAL;
    const client = newClient([event]);
    const badHttpStatus = [500, 503];
    const status =
      badHttpStatus[Math.floor(Math.random() * badHttpStatus.length)];

    const promise = new Promise(resolve => {
      let count = 0;
      client.on(CEVENTS.ERROR, (err: any) => {
        expect(err.status).toBe(status);

        if (count > 2) {
          resolve();
        }
        count++;
      });
    });

    client.start({
      queryParams: {
        resStatus: status,
      },
    });
    await promise;
    client.stop();
  });

  test('should auto reconnect when server close connection', async () => {
    const client = newClient(['nodata-event']);
    const promise = new Promise(resolve => {
      let index = 0;
      client.on(CEVENTS.MESSAGE, () => {
        if (index > 2) {
          resolve();
        }
        index++;
      });
    });

    client.start();
    await promise;
    client.stop();
  });

  test('should get response from multiple events', async () => {
    const events = [EVENTS.TEST_MULTIPLE_1, EVENTS.TEST_MULTIPLE_2];
    const client = newClient(events);
    const promise = newMultipleEventsPromise(client, events);

    client.start();
    await promise;
    client.stop();
  });

  test('should not auto reconnect when options.reconnect = false', async () => {
    const client = newClient(['nodata-event'], { reconnect: false });
    let index = 0;
    const promise = new Promise(async resolve => {
      let flag = false;
      client.on(CEVENTS.MESSAGE, data => {
        index++;
        flag = true;
      });

      // wait to see if client reconnected and received more messages
      await bluebird.delay(3000);
      flag && resolve();
    });

    client.start();
    await promise;
    expect(index).toBe(1);
    client.stop();
  });

  test('should not reconnect when client is closed', async () => {
    const client = newClient(['nodata-event']);
    let index = 0;
    const promise = new Promise(async resolve => {
      client.on(CEVENTS.MESSAGE, () => {
        index++;
        resolve();
      });
    });

    client.start();
    await promise;
    client.stop();

    await bluebird.delay(3000);
    expect(index).toBe(1);
  });

  test('should reconnect when client restart', async () => {
    const client = newClient(['nodata-event'], { reconnect: false });
    let index = 0;
    client.on(CEVENTS.MESSAGE, data => {
      index++;
    });

    client.start();

    // wait client to close
    const promise = new Promise(async resolve => {
      setInterval(() => {
        !client.isConnected() && resolve();
      }, 500);
    });
    await promise;

    client.restart();
    expect(client.isConnected()).toBe(true);
    // wait new message
    await bluebird.delay(1000);
    expect(index).toBeGreaterThan(1);
    client.stop();
  });

  test('should request set query params when exec client.setQueryParams()', async () => {
    const event = EVENTS.TEST_NORMAL;
    const client = newClient([event]);
    const badHttpStatus = [400, 401, 403, 500, 503];
    const status =
      badHttpStatus[Math.floor(Math.random() * badHttpStatus.length)];

    const promise = new Promise(resolve => {
      client.on(CEVENTS.ERROR, (err: any) => {
        expect(err.status).toBe(status);
        resolve();
      });
    });

    client.addQueryParams({
      resStatus: status,
    });
    const params = client.addQueryParams({
      otherParams: 'foo',
    });
    expect(params).toStrictEqual({
      resStatus: status,
      otherParams: 'foo',
    });
    client.start();
    await promise;
    client.stop();
  });

  test('should get response from multiple events after add event', async () => {
    const client = newClient([EVENTS.TEST_MULTIPLE_1]);
    client.start();

    await bluebird.delay(100);
    client.addEvent(EVENTS.TEST_MULTIPLE_2);

    // wait client reconnect
    await new Promise((resolve, reject) => {
      client.on(CEVENTS.CONNECTED, resolve);
    });

    const promise = newMultipleEventsPromise(client, [
      EVENTS.TEST_MULTIPLE_1,
      EVENTS.TEST_MULTIPLE_2,
    ]);
    await promise;
    client.stop();
  });

  test('should get response from single event after remove event', async () => {
    const events = [EVENTS.TEST_MULTIPLE_1, EVENTS.TEST_MULTIPLE_2];
    const client = newClient(events);
    client.start();

    await bluebird.delay(100);
    client.removeEvent(EVENTS.TEST_MULTIPLE_1);

    // wait client reconnect
    await new Promise((resolve, reject) => {
      client.on(CEVENTS.CONNECTED, resolve);
    });

    const promise = newEventPromise(client, EVENTS.TEST_MULTIPLE_2);
    await promise;
    client.stop();
  });

  test.skip('should only restart once when add multiple events continuously', async () => {
    const client = newClient(['nodata-event']);
    client.start();

    client.addEvent('event1');
    client.addEvent('event2');
    client.addEvent('event3');

    let count = 0;
    client.on(CEVENTS.CONNECTED, () => {
      count++;
    });
    // wait the three "addEvent" done
    await bluebird.delay(1000);
    expect(count).toBe(1);
  });
});

function newMultipleEventsPromise(client: Client, events: string[]) {
  return new Promise(resolve => {
    const eventIndex: any = {};
    eventIndex[EVENTS.TEST_MULTIPLE_1] = 0;
    eventIndex[EVENTS.TEST_MULTIPLE_2] = 0;
    client.on(CEVENTS.MESSAGE, data => {
      expect(events.includes(data.event)).toBeTruthy();
      const message = EVENT_DATA[data.event];
      expect(data.message).toBe(
        JSON.stringify(message[eventIndex[data.event]])
      );
      eventIndex[data.event]++;

      let eventsMessageDone = true;
      for (const event of events) {
        eventsMessageDone = EVENT_DATA[event].length === eventIndex[data.event];
      }
      if (eventsMessageDone) {
        resolve();
      }
    });
  });
}

function newEventPromise(client: Client, event: string) {
  return new Promise(resolve => {
    let index = 0;
    const message = EVENT_DATA[event];
    client.on(CEVENTS.MESSAGE, data => {
      expect(data.event).toBe(event);
      expect(data.message).toBe(JSON.stringify(message[index]));
      index++;

      if (message.length === index) {
        resolve();
        return;
      }
    });
  });
}

import Client from '../src/client';
import { BASE_URL } from './helpers/constants';
import { EVENTS, EVENT_DATA } from './helpers/mock_data';

const Bluebird = require('bluebird');

function newClient(events: string[], options?: any) {
  return new Client(BASE_URL + '/files/guid/pull', events, options);
}

describe('sse-io client', () => {
  test('should get response from single event', async () => {
    const event = EVENTS.TEST_NORMAL;
    const client = newClient([event]);
    const promise = new Promise((resolve) => {
      let index = 0;
      const message = EVENT_DATA[event];
      client.onMessage((data) => {
        expect(data.event).toBe(event)
        expect(data.message).toBe(JSON.stringify(message[index]))
        index++;

        if (message.length === index) {
          resolve();
          return;
        }
      })
    })
    
    client.start();
    await promise;
    client.stop();
  })

  test('should emit error event when receive 4xx or 5xx http status', async () => {
    const event = EVENTS.TEST_NORMAL;
    const client = newClient([event]);
    const badHttpStatus = [400, 401, 403, 500, 503];
    const status = badHttpStatus[Math.floor(Math.random()*badHttpStatus.length)];;

    const promise = new Promise((resolve) => {
      client.onError((err: any) => {
        expect(err.status).toBe(status);
        resolve();
      })
    })

    client.start({
      queryParams: {
        resStatus: status
      }
    });
    await promise;
    client.stop();
  })

  test('should auto reconnect when receive 5xx http status', async () => {
    const event = EVENTS.TEST_NORMAL;
    const client = newClient([event]);
    const badHttpStatus = [500, 503];
    const status = badHttpStatus[Math.floor(Math.random()*badHttpStatus.length)];;

    const promise = new Promise((resolve) => {
      let count = 0;
      client.onError((err: any) => {
        expect(err.status).toBe(status);

        if (count > 2) {
          resolve();
        }
        count++
      })
    })

    client.start({
      queryParams: {
        resStatus: status
      }
    });
    await promise;
    client.stop();
  })

  test('should auto reconnect when server close connection', async () => {
    const client = newClient(['nodata-event']);
    const promise = new Promise((resolve) => {
      let index = 0;
      client.onMessage(() => {
        if (index > 2) {
          resolve();
        }
        index++;
      })
    })
    
    client.start()
    await promise;
    client.stop();
  })

  test('should get response from multiple events', async () => {
    const events = [EVENTS.TEST_MULTIPLE_1, EVENTS.TEST_MULTIPLE_2];
    const client = newClient(events);
    const promise = new Promise((resolve) => {
      const eventIndex: any = {}
      eventIndex[EVENTS.TEST_MULTIPLE_1] = 0
      eventIndex[EVENTS.TEST_MULTIPLE_2] = 0
      client.onMessage((data) => {
        expect(events.includes(data.event)).toBeTruthy()
        const message = EVENT_DATA[data.event];
        expect(data.message).toBe(JSON.stringify(message[eventIndex[data.event]]))
        eventIndex[data.event]++;

        let eventsMessageDone = true;
        for (const event of events) {
          eventsMessageDone = EVENT_DATA[event].length === eventIndex[data.event]
        }
        if (eventsMessageDone) {
          resolve();
        }
      })
    })
    
    client.start()
    await promise;
    client.stop();
  })

  test('should not auto reconnect when options.reconnect = false', async () => {
    const client = newClient(['nodata-event'], { reconnect: false });
    let index = 0;
    const promise = new Promise(async (resolve) => {
      let flag = false;
      client.onMessage((data) => {
        index++;
        flag = true;
      })

      // wait to see if client reconnected and received more messages
      await Bluebird.delay(3000);
      flag && resolve();
    })
    
    client.start();
    await promise;
    expect(index).toBe(1);
    client.stop();
  })

  test('should not reconnect when client is closed', async () => {
    const client = newClient(['nodata-event']);
    let index = 0;
    const promise = new Promise(async (resolve) => {
      client.onMessage(() => {
        index++;
        resolve();
      })
    })
    
    client.start();
    await promise;
    client.stop();

    await Bluebird.delay(3000);
    expect(index).toBe(1);
  })
})

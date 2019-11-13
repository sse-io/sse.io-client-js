import Client from '../src/client';
import { BASE_URL } from './helpers/constants';
import { EVENTS, EVENT_DATA } from './helpers/mock_data';

const Bluebird = require('bluebird');

function newClient(events: string[]) {
  return new Client(BASE_URL + '/files/guid/pull', events);
}

describe('sse-io client', () => {
  test('should get message from server', async () => {
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
    
    client.start()
    await promise.then(() => client.stop());
  })

  test('should return 4xx or 5xx http status', async () => {
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
    await promise.then(() => client.stop());
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
    await promise.then(() => client.stop());
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
    await promise.then(() => client.stop());
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
    await promise.then(() => client.stop());
  })
  test('should set headers works fine', async () => {})
  test('should not auto reconnect when options.reconnect = false', async () => {})
  test('should not reconnect when client is closed', async () => {})
})

import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import { PassThrough } from 'stream';

import { EVENT_DATA } from './mock_data';
import { PORT } from './constants';

const bluebird = require('bluebird');

function getEventData(stream: PassThrough, event: string, cb: () => void) {
  const responseData = EVENT_DATA[event];
  if (!responseData) {
    stream.write(`event: ${event}\ndata: \n\n`);
    setTimeout(() => {
      cb();
    }, 0);
  } else {
    setTimeout(async () => {
      let index = 0;
      while (true) {
        if (!responseData[index]) {
          break;
        }
        stream.write(
          `event: ${event}\ndata: ${JSON.stringify(responseData[index])}\n\n`
        );
        index++;
        await bluebird.delay(1000);
      }
      cb();
    }, 0);
  }
}

export function startServer() {
  const app = new Koa();
  const router = new Router();
  app.use(koaBody());

  router.get('/files/:guid/pull', (ctx: any) => {
    const stream = new PassThrough();
    let events: any[] = [];
    if (ctx.request.query.events instanceof Array) {
      events = ctx.request.query.events;
    } else {
      events[0] = ctx.request.query.events;
    }

    const { resStatus } = ctx.request.query;
    if (resStatus && !isNaN(resStatus)) {
      ctx.res.writeHead(Number(resStatus), {
        'Content-Type': 'application/json',
      });
      return;
    }

    ctx.res.writeHead(200, {
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    });

    if (events.length === 1) {
      getEventData(stream, events[0], () => ctx.res.end());
    } else {
      const promises: any[] = [];
      for (const event of events) {
        const promise = new Promise(resolve => {
          getEventData(stream, event, resolve);
        });
        promises.push(promise);
      }

      setTimeout(async () => {
        await Promise.all(promises);
        ctx.res.end();
      }, 0);
    }

    ctx.body = stream;
  });

  app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(PORT);
}

# SSE-IO Client-JS

JavaScript Client For SSE-IO. 
You can use it with Node.js or as a browser polyfill for browsers that don't have native EventSource support.

## How to use

You can serve the file `sse.io-client.js` found in the `dist` folder or include it via [CDN](https://unpkg.com/sse.io-client@1.1.0/dist/sse.io-client.js)

```html
<script src="/dist/sse.io-client.js"></script>
<script>
  var client = sseio.client('http://localhost', ['event']);
  client.start();
  client.onMessage(function(data) {
  	console.log(data);
  })
  client.onError(function(err) {
  	console.error(err);
  })
</script>
```

Import using ES6
```js
import * as sseio from 'sse.io-client';

const client = sseio.client('http://localhost', ['event']);
```

## API

### SSEIO

> you should always create a client first

#### client(url, events, options)

 - `url` _(String, Required)_ url path for SSE connection.
 - `events` _(Array[String], Required)_ the `EventSource` created by client will addEventListener to the events. Also, it will be add to query params to the SSE http request.
 - `options` _(Object, Optional)_
    - `reconnect` _(Boolean)_ (default to `true`) client will auto reconnect when can't connect to server, connections closed by server or receiving 5xx http status.
    - `backoffOptions` _(Object)_ [implements from backo](https://github.com/mokesmokes/backo#options). Client will delay reconnect when receiving 5xx http status or can't connect to server.
 - **Returns** `Client`

### Client

#### client.start(options)

 - `options` _(Object, Optional)_
    - `headers` _(Object)_ [implements from eventsoure](https://github.com/EventSource/eventsource#setting-http-request-headers)
    - `proxy` _(String)_ [implements from eventsoure](https://github.com/EventSource/eventsource#setting-http-request-headers)
    - `https` _(Object)_ [implements from eventsoure](https://github.com/EventSource/eventsource#setting-http-request-headers)
    - `withCredentials` _(Boolean)_ when you send CORS request, you can set it to `true` to enable sending cookie.
    - `forceXhr` _(Boolean)_ use `XMLHttpRequest` when `Fetch` is not support by some browers.
    - `queryParams` _(Object)_ your custom query parameters

Creates a new EventSource, establishing the SSE connection, and register listeners for the `events`.

#### client.stop()

Close the EventSource, as well as closing the SSE connection.

#### client.restart()

Equals to `client.stop() && client.start()`, using the latest options.

#### client.addQueryParams(params)

 - `params` _(Object)_ your custom query parameters

Add query parameters for SSE request. **It will be passed to the server when the SSE connection is established next time.**

#### client.isConnected()

 - **Returns** _(Boolean)_

Whether or not The SSE connection is connected to the server.

#### client.addEvent(event, queryParams)

 - `event` _(String, Required)_
 - `params` _(Object, Optional)_

Add an event to `events`. You can add query params too. Then **the client will restart** to make it take effect.

#### client.removeEvent(event)

 - `event` _(String, Required)_

Remove an event from `events`. Then **the client will restart** to make it take effect.

#### client.on(eventName, callback)

Register a handler for the event

**Event: 'message'**

 - `callback` _(Function)_ an Object `data` will be passed to the callback function
    - `data.event` _(String)_
    - `data.message` _(String)_

Handle received message from server for the registered events.

```js
client.on('message', (data) => {
   // ...
})
```

**Event: 'error'**

 - `callback` _(Function)_ an `Error` will be passed to the callback function
    - `error.message` _(String)_
    - `error.status` _(Number)_ (default to -1) the http status received from server
    - `error.reason` _(String)_ possible values: 'can't connect to server', 'http error'

Handle error message. Including the http error as well as the `EventSource` error or close message.

```js
client.on('error', (err) => {
   // ...
})
```

**Event: 'connected'**

Fired upon a connection.

**Event: 'disconnect'**

Fired upon a disconnection.

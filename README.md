# SSE-IO Client-JS

JavaScript Client For SSE-IO. 
You can use it with Node.js or as a browser polyfill for browsers that don't have native EventSource support.

## How to use

You can serve the file `sse.io-client.js` found in the `dist` folder or include it via [CDN](https://unpkg.com/sse.io-client@1.0.0/dist/sse.io-client.js)

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
import sseio from 'sse.io-client';

const client = sseio.client('http://localhost', ['event']);
```

## API

### SSEIO

> you should always create a client first

#### client(url, events, options)

 - `url` _(String, Required)_ url path for SSE connection.
 - `events` _(String, Required)_ the `EventSource` created by client will addEventListener to the events. Also, it will be add to query params to the SSE request.
 - `options` _(Object, Optional)_
    - `reconnect` _(Boolean)_ (default to `true`) should auto reconnect when server close the connection or receive 5xx http status.
    - `backoffOptions` _(Object)_ [implements from backo](https://github.com/mokesmokes/backo#options)
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

#### client.close()

Close the EventSource

#### client.onMessage(callback)

 - `callback` _(Function)_ an Object `data` will be passed to the callback function
    - `data.event` _(String)_
    - `data.message` _(String)_

Handle received message for registered events from server

#### client.onError(callback)

 - `callback` _(Function)_ an `Error` will be passed to the callback function
    - `error.message` _(String)_
    - `error.status` _(Number)_ (default to -1) the http status received from server
    - `error.reason` _(String)_ possible values: 'client offline', 'http error'

Handle error message

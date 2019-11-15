/*! For license information please see sse.io-client.js.LICENSE */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.sseio=e():t.sseio=e()}(window,(function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=3)}([function(t,e){var n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof window.msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto);if(n){var r=new Uint8Array(16);t.exports=function(){return n(r),r}}else{var o=new Array(16);t.exports=function(){for(var t,e=0;e<16;e++)0==(3&e)&&(t=4294967296*Math.random()),o[e]=t>>>((3&e)<<3)&255;return o}}},function(t,e){for(var n=[],r=0;r<256;++r)n[r]=(r+256).toString(16).substr(1);t.exports=function(t,e){var r=e||0,o=n;return[o[t[r++]],o[t[r++]],o[t[r++]],o[t[r++]],"-",o[t[r++]],o[t[r++]],"-",o[t[r++]],o[t[r++]],"-",o[t[r++]],o[t[r++]],"-",o[t[r++]],o[t[r++]],o[t[r++]],o[t[r++]],o[t[r++]],o[t[r++]]].join("")}},function(t,e,n){"use strict";var r,o=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){function e(e,n,r){void 0===r&&(r=-1);var o=t.call(this,e)||this;return o.reason=n,o.status=r,o}return o(e,t),e}(Error);e.ClientError=i},function(t,e,n){"use strict";var r=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});var o=r(n(4)),i=n(2);e.ClientError=i.ClientError,e.client=function(t,e,n){return new o.default(t,e,n)}},function(t,e,n){"use strict";var r,o=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),i=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e},s=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});var c=n(5),a=i(n(6)),u=i(n(10)),l=s(n(13)),f=n(17),p=n(18),h=n(19),d=n(2),v=l.default("sse-io-client"),y="message",m="error",g={min:100,max:5e3,jitter:.5},C=function(t){function e(e,n,r){var o=t.call(this)||this;return o.reconnect=!0,o.stopped=!1,o.url=e,o.events=n,o.clientId=u.v4().toString(),r&&r.hasOwnProperty("reconnect")&&(o.reconnect=!!r.reconnect),o.backoff=new h(p(g,r&&r.backoffOptions)),o}return o(e,t),e.prototype.start=function(t){this.stopped=!1,this.sseOptions=t,this.pull()},e.prototype.stop=function(){this.stopped||(this.eventSource&&this.eventSource.close(),this.stopped=!0)},e.prototype.onMessage=function(t){this.on(y,t)},e.prototype.onError=function(t){this.on(m,t)},e.prototype.pull=function(){var t=this;if(!this.stopped){for(var e=this.genEventSourceUrl(),n=this.eventSource=new f(e,this.sseOptions),r=function(e){n.addEventListener(e,(function(n){t.emit(y,{event:e,message:n.data})}))},o=0,i=this.events;o<i.length;o++){r(i[o])}n.onerror=function(e){t.onEventSourceErrorOrClose(e)},n.addEventListener("close",(function(e){t.onEventSourceErrorOrClose(e)}))}},e.prototype.genEventSourceUrl=function(){var t=this.url.split("?"),e=t[0],n=t[1],r=a.parse(n);return p(r,{clientId:this.clientId,events:this.events},this.sseOptions&&this.sseOptions.queryParams),e+"?"+a.stringify(r)},e.prototype.onEventSourceErrorOrClose=function(t){if(this.eventSource)try{this.eventSource.close(),this.eventSource.removeEventListener("close");for(var e=0,n=this.events;e<n.length;e++){var r=n[e];this.eventSource.removeEventListener(r)}}catch(t){v("event source closed error",t)}var o=String(t.status);return""===o||"0"===o?(this.emit(m,new d.ClientError(t.message,"client offline")),void this.delayPull(o)):"2"===o[0]?(this.backoff.reset(),void(this.reconnect&&this.pull())):(this.emit(m,new d.ClientError(t.message,"http error",t.status)),void("4"!==o[0]&&this.reconnect&&this.delayPull(o)))},e.prototype.delayPull=function(t){var e=this,n=this.backoff.duration();v("pull with status "+t+", delay "+n+"ms to reconnect"),this.backoffRunTimer&&clearTimeout(this.backoffRunTimer),this.backoffRunTimer=setTimeout((function(){return e.pull()}),n)},e}(c.EventEmitter);e.default=C},function(t,e,n){"use strict";var r=Object.prototype.hasOwnProperty,o="~";function i(){}function s(t,e,n){this.fn=t,this.context=e,this.once=n||!1}function c(t,e,n,r,i){if("function"!=typeof n)throw new TypeError("The listener must be a function");var c=new s(n,r||t,i),a=o?o+e:e;return t._events[a]?t._events[a].fn?t._events[a]=[t._events[a],c]:t._events[a].push(c):(t._events[a]=c,t._eventsCount++),t}function a(t,e){0==--t._eventsCount?t._events=new i:delete t._events[e]}function u(){this._events=new i,this._eventsCount=0}Object.create&&(i.prototype=Object.create(null),(new i).__proto__||(o=!1)),u.prototype.eventNames=function(){var t,e,n=[];if(0===this._eventsCount)return n;for(e in t=this._events)r.call(t,e)&&n.push(o?e.slice(1):e);return Object.getOwnPropertySymbols?n.concat(Object.getOwnPropertySymbols(t)):n},u.prototype.listeners=function(t){var e=o?o+t:t,n=this._events[e];if(!n)return[];if(n.fn)return[n.fn];for(var r=0,i=n.length,s=new Array(i);r<i;r++)s[r]=n[r].fn;return s},u.prototype.listenerCount=function(t){var e=o?o+t:t,n=this._events[e];return n?n.fn?1:n.length:0},u.prototype.emit=function(t,e,n,r,i,s){var c=o?o+t:t;if(!this._events[c])return!1;var a,u,l=this._events[c],f=arguments.length;if(l.fn){switch(l.once&&this.removeListener(t,l.fn,void 0,!0),f){case 1:return l.fn.call(l.context),!0;case 2:return l.fn.call(l.context,e),!0;case 3:return l.fn.call(l.context,e,n),!0;case 4:return l.fn.call(l.context,e,n,r),!0;case 5:return l.fn.call(l.context,e,n,r,i),!0;case 6:return l.fn.call(l.context,e,n,r,i,s),!0}for(u=1,a=new Array(f-1);u<f;u++)a[u-1]=arguments[u];l.fn.apply(l.context,a)}else{var p,h=l.length;for(u=0;u<h;u++)switch(l[u].once&&this.removeListener(t,l[u].fn,void 0,!0),f){case 1:l[u].fn.call(l[u].context);break;case 2:l[u].fn.call(l[u].context,e);break;case 3:l[u].fn.call(l[u].context,e,n);break;case 4:l[u].fn.call(l[u].context,e,n,r);break;default:if(!a)for(p=1,a=new Array(f-1);p<f;p++)a[p-1]=arguments[p];l[u].fn.apply(l[u].context,a)}}return!0},u.prototype.on=function(t,e,n){return c(this,t,e,n,!1)},u.prototype.once=function(t,e,n){return c(this,t,e,n,!0)},u.prototype.removeListener=function(t,e,n,r){var i=o?o+t:t;if(!this._events[i])return this;if(!e)return a(this,i),this;var s=this._events[i];if(s.fn)s.fn!==e||r&&!s.once||n&&s.context!==n||a(this,i);else{for(var c=0,u=[],l=s.length;c<l;c++)(s[c].fn!==e||r&&!s[c].once||n&&s[c].context!==n)&&u.push(s[c]);u.length?this._events[i]=1===u.length?u[0]:u:a(this,i)}return this},u.prototype.removeAllListeners=function(t){var e;return t?(e=o?o+t:t,this._events[e]&&a(this,e)):(this._events=new i,this._eventsCount=0),this},u.prototype.off=u.prototype.removeListener,u.prototype.addListener=u.prototype.on,u.prefixed=o,u.EventEmitter=u,t.exports=u},function(t,e,n){"use strict";const r=n(7),o=n(8),i=n(9);function s(t,e){return e.encode?e.strict?r(t):encodeURIComponent(t):t}function c(t,e){return e.decode?o(t):t}function a(t){const e=t.indexOf("#");return-1!==e&&(t=t.slice(0,e)),t}function u(t){const e=(t=a(t)).indexOf("?");return-1===e?"":t.slice(e+1)}function l(t,e){return e.parseNumbers&&!Number.isNaN(Number(t))&&"string"==typeof t&&""!==t.trim()?t=Number(t):!e.parseBooleans||null===t||"true"!==t.toLowerCase()&&"false"!==t.toLowerCase()||(t="true"===t.toLowerCase()),t}function f(t,e){const n=function(t){let e;switch(t.arrayFormat){case"index":return(t,n,r)=>{e=/\[(\d*)\]$/.exec(t),t=t.replace(/\[\d*\]$/,""),e?(void 0===r[t]&&(r[t]={}),r[t][e[1]]=n):r[t]=n};case"bracket":return(t,n,r)=>{e=/(\[\])$/.exec(t),t=t.replace(/\[\]$/,""),e?void 0!==r[t]?r[t]=[].concat(r[t],n):r[t]=[n]:r[t]=n};case"comma":return(t,e,n)=>{const r="string"==typeof e&&e.split("").indexOf(",")>-1?e.split(","):e;n[t]=r};default:return(t,e,n)=>{void 0!==n[t]?n[t]=[].concat(n[t],e):n[t]=e}}}(e=Object.assign({decode:!0,sort:!0,arrayFormat:"none",parseNumbers:!1,parseBooleans:!1},e)),r=Object.create(null);if("string"!=typeof t)return r;if(!(t=t.trim().replace(/^[?#&]/,"")))return r;for(const o of t.split("&")){let[t,s]=i(o.replace(/\+/g," "),"=");s=void 0===s?null:c(s,e),n(c(t,e),s,r)}for(const t of Object.keys(r)){const n=r[t];if("object"==typeof n&&null!==n)for(const t of Object.keys(n))n[t]=l(n[t],e);else r[t]=l(n,e)}return!1===e.sort?r:(!0===e.sort?Object.keys(r).sort():Object.keys(r).sort(e.sort)).reduce((t,e)=>{const n=r[e];return Boolean(n)&&"object"==typeof n&&!Array.isArray(n)?t[e]=function t(e){return Array.isArray(e)?e.sort():"object"==typeof e?t(Object.keys(e)).sort((t,e)=>Number(t)-Number(e)).map(t=>e[t]):e}(n):t[e]=n,t},Object.create(null))}e.extract=u,e.parse=f,e.stringify=(t,e)=>{if(!t)return"";const n=function(t){switch(t.arrayFormat){case"index":return e=>(n,r)=>{const o=n.length;return void 0===r?n:null===r?[...n,[s(e,t),"[",o,"]"].join("")]:[...n,[s(e,t),"[",s(o,t),"]=",s(r,t)].join("")]};case"bracket":return e=>(n,r)=>void 0===r?n:null===r?[...n,[s(e,t),"[]"].join("")]:[...n,[s(e,t),"[]=",s(r,t)].join("")];case"comma":return e=>(n,r,o)=>null==r||0===r.length?n:0===o?[[s(e,t),"=",s(r,t)].join("")]:[[n,s(r,t)].join(",")];default:return e=>(n,r)=>void 0===r?n:null===r?[...n,s(e,t)]:[...n,[s(e,t),"=",s(r,t)].join("")]}}(e=Object.assign({encode:!0,strict:!0,arrayFormat:"none"},e)),r=Object.keys(t);return!1!==e.sort&&r.sort(e.sort),r.map(r=>{const o=t[r];return void 0===o?"":null===o?s(r,e):Array.isArray(o)?o.reduce(n(r),[]).join("&"):s(r,e)+"="+s(o,e)}).filter(t=>t.length>0).join("&")},e.parseUrl=(t,e)=>({url:a(t).split("?")[0]||"",query:f(u(t),e)})},function(t,e,n){"use strict";t.exports=t=>encodeURIComponent(t).replace(/[!'()*]/g,t=>`%${t.charCodeAt(0).toString(16).toUpperCase()}`)},function(t,e,n){"use strict";var r=new RegExp("%[a-f0-9]{2}","gi"),o=new RegExp("(%[a-f0-9]{2})+","gi");function i(t,e){try{return decodeURIComponent(t.join(""))}catch(t){}if(1===t.length)return t;e=e||1;var n=t.slice(0,e),r=t.slice(e);return Array.prototype.concat.call([],i(n),i(r))}function s(t){try{return decodeURIComponent(t)}catch(o){for(var e=t.match(r),n=1;n<e.length;n++)e=(t=i(e,n).join("")).match(r);return t}}t.exports=function(t){if("string"!=typeof t)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof t+"`");try{return t=t.replace(/\+/g," "),decodeURIComponent(t)}catch(e){return function(t){for(var e={"%FE%FF":"��","%FF%FE":"��"},n=o.exec(t);n;){try{e[n[0]]=decodeURIComponent(n[0])}catch(t){var r=s(n[0]);r!==n[0]&&(e[n[0]]=r)}n=o.exec(t)}e["%C2"]="�";for(var i=Object.keys(e),c=0;c<i.length;c++){var a=i[c];t=t.replace(new RegExp(a,"g"),e[a])}return t}(t)}}},function(t,e,n){"use strict";t.exports=(t,e)=>{if("string"!=typeof t||"string"!=typeof e)throw new TypeError("Expected the arguments to be of type `string`");if(""===e)return[t];const n=t.indexOf(e);return-1===n?[t]:[t.slice(0,n),t.slice(n+e.length)]}},function(t,e,n){var r=n(11),o=n(12),i=o;i.v1=r,i.v4=o,t.exports=i},function(t,e,n){var r,o,i=n(0),s=n(1),c=0,a=0;t.exports=function(t,e,n){var u=e&&n||0,l=e||[],f=(t=t||{}).node||r,p=void 0!==t.clockseq?t.clockseq:o;if(null==f||null==p){var h=i();null==f&&(f=r=[1|h[0],h[1],h[2],h[3],h[4],h[5]]),null==p&&(p=o=16383&(h[6]<<8|h[7]))}var d=void 0!==t.msecs?t.msecs:(new Date).getTime(),v=void 0!==t.nsecs?t.nsecs:a+1,y=d-c+(v-a)/1e4;if(y<0&&void 0===t.clockseq&&(p=p+1&16383),(y<0||d>c)&&void 0===t.nsecs&&(v=0),v>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");c=d,a=v,o=p;var m=(1e4*(268435455&(d+=122192928e5))+v)%4294967296;l[u++]=m>>>24&255,l[u++]=m>>>16&255,l[u++]=m>>>8&255,l[u++]=255&m;var g=d/4294967296*1e4&268435455;l[u++]=g>>>8&255,l[u++]=255&g,l[u++]=g>>>24&15|16,l[u++]=g>>>16&255,l[u++]=p>>>8|128,l[u++]=255&p;for(var C=0;C<6;++C)l[u+C]=f[C];return e||s(l)}},function(t,e,n){var r=n(0),o=n(1);t.exports=function(t,e,n){var i=e&&n||0;"string"==typeof t&&(e="binary"===t?new Array(16):null,t=null);var s=(t=t||{}).random||(t.rng||r)();if(s[6]=15&s[6]|64,s[8]=63&s[8]|128,e)for(var c=0;c<16;++c)e[i+c]=s[c];return e||o(s)}},function(t,e,n){(function(r){e.log=function(...t){return"object"==typeof console&&console.log&&console.log(...t)},e.formatArgs=function(e){if(e[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+e[0]+(this.useColors?"%c ":" ")+"+"+t.exports.humanize(this.diff),!this.useColors)return;const n="color: "+this.color;e.splice(1,0,n,"color: inherit");let r=0,o=0;e[0].replace(/%[a-zA-Z%]/g,t=>{"%%"!==t&&(r++,"%c"===t&&(o=r))}),e.splice(o,0,n)},e.save=function(t){try{t?e.storage.setItem("debug",t):e.storage.removeItem("debug")}catch(t){}},e.load=function(){let t;try{t=e.storage.getItem("debug")}catch(t){}!t&&void 0!==r&&"env"in r&&(t=r.env.DEBUG);return t},e.useColors=function(){if("undefined"!=typeof window&&window.process&&("renderer"===window.process.type||window.process.__nwjs))return!0;if("undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;return"undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)},e.storage=function(){try{return localStorage}catch(t){}}(),e.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"],t.exports=n(15)(e);const{formatters:o}=t.exports;o.j=function(t){try{return JSON.stringify(t)}catch(t){return"[UnexpectedJSONParseError]: "+t.message}}}).call(this,n(14))},function(t,e){var n,r,o=t.exports={};function i(){throw new Error("setTimeout has not been defined")}function s(){throw new Error("clearTimeout has not been defined")}function c(t){if(n===setTimeout)return setTimeout(t,0);if((n===i||!n)&&setTimeout)return n=setTimeout,setTimeout(t,0);try{return n(t,0)}catch(e){try{return n.call(null,t,0)}catch(e){return n.call(this,t,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:i}catch(t){n=i}try{r="function"==typeof clearTimeout?clearTimeout:s}catch(t){r=s}}();var a,u=[],l=!1,f=-1;function p(){l&&a&&(l=!1,a.length?u=a.concat(u):f=-1,u.length&&h())}function h(){if(!l){var t=c(p);l=!0;for(var e=u.length;e;){for(a=u,u=[];++f<e;)a&&a[f].run();f=-1,e=u.length}a=null,l=!1,function(t){if(r===clearTimeout)return clearTimeout(t);if((r===s||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(t);try{r(t)}catch(e){try{return r.call(null,t)}catch(e){return r.call(this,t)}}}(t)}}function d(t,e){this.fun=t,this.array=e}function v(){}o.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];u.push(new d(t,e)),1!==u.length||l||c(h)},d.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=v,o.addListener=v,o.once=v,o.off=v,o.removeListener=v,o.removeAllListeners=v,o.emit=v,o.prependListener=v,o.prependOnceListener=v,o.listeners=function(t){return[]},o.binding=function(t){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(t){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},function(t,e,n){t.exports=function(t){function e(t){let e=0;for(let n=0;n<t.length;n++)e=(e<<5)-e+t.charCodeAt(n),e|=0;return r.colors[Math.abs(e)%r.colors.length]}function r(t){let n;function s(...t){if(!s.enabled)return;const e=s,o=Number(new Date),i=o-(n||o);e.diff=i,e.prev=n,e.curr=o,n=o,t[0]=r.coerce(t[0]),"string"!=typeof t[0]&&t.unshift("%O");let c=0;t[0]=t[0].replace(/%([a-zA-Z%])/g,(n,o)=>{if("%%"===n)return n;c++;const i=r.formatters[o];if("function"==typeof i){const r=t[c];n=i.call(e,r),t.splice(c,1),c--}return n}),r.formatArgs.call(e,t),(e.log||r.log).apply(e,t)}return s.namespace=t,s.enabled=r.enabled(t),s.useColors=r.useColors(),s.color=e(t),s.destroy=o,s.extend=i,"function"==typeof r.init&&r.init(s),r.instances.push(s),s}function o(){const t=r.instances.indexOf(this);return-1!==t&&(r.instances.splice(t,1),!0)}function i(t,e){const n=r(this.namespace+(void 0===e?":":e)+t);return n.log=this.log,n}function s(t){return t.toString().substring(2,t.toString().length-2).replace(/\.\*\?$/,"*")}return r.debug=r,r.default=r,r.coerce=function(t){if(t instanceof Error)return t.stack||t.message;return t},r.disable=function(){const t=[...r.names.map(s),...r.skips.map(s).map(t=>"-"+t)].join(",");return r.enable(""),t},r.enable=function(t){let e;r.save(t),r.names=[],r.skips=[];const n=("string"==typeof t?t:"").split(/[\s,]+/),o=n.length;for(e=0;e<o;e++)n[e]&&("-"===(t=n[e].replace(/\*/g,".*?"))[0]?r.skips.push(new RegExp("^"+t.substr(1)+"$")):r.names.push(new RegExp("^"+t+"$")));for(e=0;e<r.instances.length;e++){const t=r.instances[e];t.enabled=r.enabled(t.namespace)}},r.enabled=function(t){if("*"===t[t.length-1])return!0;let e,n;for(e=0,n=r.skips.length;e<n;e++)if(r.skips[e].test(t))return!1;for(e=0,n=r.names.length;e<n;e++)if(r.names[e].test(t))return!0;return!1},r.humanize=n(16),Object.keys(t).forEach(e=>{r[e]=t[e]}),r.instances=[],r.names=[],r.skips=[],r.formatters={},r.selectColor=e,r.enable(r.load()),r}},function(t,e){var n=1e3,r=60*n,o=60*r,i=24*o,s=7*i,c=365.25*i;function a(t,e,n,r){var o=e>=1.5*n;return Math.round(t/n)+" "+r+(o?"s":"")}t.exports=function(t,e){e=e||{};var u=typeof t;if("string"===u&&t.length>0)return function(t){if((t=String(t)).length>100)return;var e=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(t);if(!e)return;var a=parseFloat(e[1]);switch((e[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return a*c;case"weeks":case"week":case"w":return a*s;case"days":case"day":case"d":return a*i;case"hours":case"hour":case"hrs":case"hr":case"h":return a*o;case"minutes":case"minute":case"mins":case"min":case"m":return a*r;case"seconds":case"second":case"secs":case"sec":case"s":return a*n;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return a;default:return}}(t);if("number"===u&&isFinite(t))return e.long?function(t){var e=Math.abs(t);if(e>=i)return a(t,e,i,"day");if(e>=o)return a(t,e,o,"hour");if(e>=r)return a(t,e,r,"minute");if(e>=n)return a(t,e,n,"second");return t+" ms"}(t):function(t){var e=Math.abs(t);if(e>=i)return Math.round(t/i)+"d";if(e>=o)return Math.round(t/o)+"h";if(e>=r)return Math.round(t/r)+"m";if(e>=n)return Math.round(t/n)+"s";return t+"ms"}(t);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(t))}},function(t,e){var n=window.setTimeout.bind(window),r=window.clearTimeout.bind(window),o=window.XMLHttpRequest,i=window.XDomainRequest,s=window.document,c=window.Promise,a=window.fetch.bind(window),u=window.Response,l=window.TextDecoder,f=window.TextEncoder,p=window.AbortController,h=5e3;if(null==Object.create&&(Object.create=function(t){function e(){}return e.prototype=t,new e}),null!=c&&null==c.prototype.finally&&(c.prototype.finally=function(t){return this.then((function(e){return c.resolve(t()).then((function(){return e}))}),(function(e){return c.resolve(t()).then((function(){throw e}))}))}),null!=a){var d=a;a=function(t,e){return c.resolve(d(t,e))}}function v(){this.bitsNeeded=0,this.codePoint=0}null==p&&(p=function(){this.signal=null,this.abort=function(){}}),v.prototype.decode=function(t){function e(t,e,n){if(1===n)return t>=128>>e&&t<<e<=2047;if(2===n)return t>=2048>>e&&t<<e<=55295||t>=57344>>e&&t<<e<=65535;if(3===n)return t>=65536>>e&&t<<e<=1114111;throw new Error}function n(t,e){if(6===t)return e>>6>15?3:e>31?2:1;if(12===t)return e>15?3:2;if(18===t)return 3;throw new Error}for(var r="",o=this.bitsNeeded,i=this.codePoint,s=0;s<t.length;s+=1){var c=t[s];0!==o&&(c<128||c>191||!e(i<<6|63&c,o-6,n(o,i)))&&(o=0,i=65533,r+=String.fromCharCode(i)),0===o?(c>=0&&c<=127?(o=0,i=c):c>=192&&c<=223?(o=6,i=31&c):c>=224&&c<=239?(o=12,i=15&c):c>=240&&c<=247?(o=18,i=7&c):(o=0,i=65533),0===o||e(i,o,n(o,i))||(o=0,i=65533)):(o-=6,i=i<<6|63&c),0===o&&(i<=65535?r+=String.fromCharCode(i):(r+=String.fromCharCode(55296+(i-65535-1>>10)),r+=String.fromCharCode(56320+(i-65535-1&1023))))}return this.bitsNeeded=o,this.codePoint=i,r};null!=l&&null!=f&&function(){try{return"test"===(new l).decode((new f).encode("test"),{stream:!0})}catch(t){console.log(t)}return!1}()||(l=v);var y=function(){};function m(t){this.withCredentials=!1,this.responseType="",this.readyState=0,this.status=0,this.statusText="",this.responseText="",this.onprogress=y,this.onreadystatechange=y,this._contentType="",this._xhr=t,this._sendTimeout=0,this._abort=y}function g(t){return t.replace(/[A-Z]/g,(function(t){return String.fromCharCode(t.charCodeAt(0)+32)}))}function C(t){for(var e=Object.create(null),n=t.split("\r\n"),r=0;r<n.length;r+=1){var o=n[r].split(": "),i=o.shift(),s=o.join(": ");e[g(i)]=s}this._map=e}function w(){}function b(t){this._headers=t}function x(){}function _(){this._listeners=Object.create(null)}function O(t){n((function(){throw t}),0)}function F(t,e){for(var n in this.type=t,this.target=void 0,e)this.hasOwnProperty(n)||(this[n]=e[n])}function j(t,e){F.call(this,t),this.data=e.data,this.lastEventId=e.lastEventId}function E(t,e){F.call(this,t),this.status=e.status,this.statusText=e.statusText,this.headers=e.headers}m.prototype.open=function(t,e){this._abort(!0);var i=this,s=this._xhr,c=1,a=0;this._abort=function(t){0!==i._sendTimeout&&(r(i._sendTimeout),i._sendTimeout=0),1!==c&&2!==c&&3!==c||(c=4,s.onload=y,s.onerror=y,s.onabort=y,s.onprogress=y,s.onreadystatechange=y,s.abort(),0!==a&&(r(a),a=0),t||(i.readyState=4,i.onreadystatechange())),c=0};var u=function(){if(1===c){var t=0,e="",n=void 0;if("contentType"in s)t=200,e="OK",n=s.contentType;else try{t=s.status,e=s.statusText,n=s.getResponseHeader("Content-Type")}catch(r){t=0,e="",n=void 0}0!==t&&(c=2,i.readyState=2,i.status=t,i.statusText=e,i._contentType=n,i.onreadystatechange())}},l=function(){if(u(),2===c||3===c){c=3;var t="";try{t=s.responseText}catch(t){}i.readyState=3,i.responseText=t,i.onprogress()}},f=function(){l(),1!==c&&2!==c&&3!==c||(c=4,0!==a&&(r(a),a=0),i.readyState=4,i.onreadystatechange())},p=function(){a=n((function(){p()}),500),3===s.readyState&&l()};s.onload=f,s.onerror=f,s.onabort=f,"sendAsBinary"in o.prototype||"mozAnon"in o.prototype||(s.onprogress=l),s.onreadystatechange=function(){null!=s&&(4===s.readyState?f():3===s.readyState?l():2===s.readyState&&u())},"contentType"in s&&(e+=(-1===e.indexOf("?")?"?":"&")+"padding=true"),s.open(t,e,!0),"readyState"in s&&(a=n((function(){p()}),0))},m.prototype.abort=function(){this._abort(!1)},m.prototype.getResponseHeader=function(t){return this._contentType},m.prototype.setRequestHeader=function(t,e){var n=this._xhr;"setRequestHeader"in n&&n.setRequestHeader(t,e)},m.prototype.getAllResponseHeaders=function(){return null!=this._xhr.getAllResponseHeaders?this._xhr.getAllResponseHeaders():""},m.prototype.send=function(){if("ontimeout"in o.prototype||null==s||null==s.readyState||"complete"===s.readyState){var t=this._xhr;t.withCredentials=this.withCredentials,t.responseType=this.responseType;try{t.send(void 0)}catch(t){throw t}}else{var e=this;e._sendTimeout=n((function(){e._sendTimeout=0,e.send()}),4)}},C.prototype.get=function(t){return this._map[g(t)]},w.prototype.open=function(t,e,o,i,s,c,a){t.open("GET",s);var u,l=0;function f(){u=n((function(){t.abort()}),h)}for(var p in f(),t.onprogress=function(){var e=t.responseText.slice(l);l+=e.length,e.length>0&&(r(u),f()),o(e)},t.onreadystatechange=function(){if(2===t.readyState){var n=t.status,r=t.statusText,o=t.getResponseHeader("Content-Type"),s=t.getAllResponseHeaders();e(n,r,o,new C(s),(function(){t.abort()}))}else 4===t.readyState&&i()},t.withCredentials=c,t.responseType="text",a)Object.prototype.hasOwnProperty.call(a,p)&&t.setRequestHeader(p,a[p]);t.send()},b.prototype.get=function(t){return this._headers.get(t)},x.prototype.open=function(t,e,o,i,s,u,f){var d=new p,v=d.signal,y=new l;a(s,{headers:f,credentials:u?"include":"same-origin",signal:v,cache:"no-store"}).then((function(t){var i=t.body.getReader();return e(t.status,t.statusText,t.headers.get("Content-Type"),new b(t.headers),(function(){d.abort(),i.cancel().catch((function(){}))})),new c((function(t,e){var s=function(){new c((function(t,e){var o=n((function(){e(new Error("Reader read timeout")),o=null}),h);i.read().then((function(e){o&&(r(o),t(e))}),e)})).then((function(e){if(e.done)t(void 0);else{var n=y.decode(e.value,{stream:!0});o(n),s()}})).catch((function(t){e(t)}))};s()}))})).catch((function(){})).finally((function(){i()}))},_.prototype.dispatchEvent=function(t){t.target=this;var e=this._listeners[t.type];if(null!=e)for(var n=e.length,r=0;r<n;r+=1){var o=e[r];try{"function"==typeof o.handleEvent?o.handleEvent(t):o.call(this,t)}catch(t){O(t)}}},_.prototype.addEventListener=function(t,e){t=String(t);var n=this._listeners,r=n[t];null==r&&(r=[],n[t]=r);for(var o=!1,i=0;i<r.length;i+=1)r[i]===e&&(o=!0);o||r.push(e)},_.prototype.removeEventListener=function(t,e){t=String(t);var n=this._listeners,r=n[t];if(null!=r){for(var o=[],i=0;i<r.length;i+=1)r[i]!==e&&o.push(r[i]);0===o.length?delete n[t]:n[t]=o}},j.prototype=Object.create(F.prototype),E.prototype=Object.create(F.prototype);var T=-1,S=0,A=1,k=2,R=-1,M=0,P=1,N=2,L=3,I=/^text\/event\-stream;?(\s*charset\=utf\-8)?$/i,U=function(t,e){var n=parseInt(t,10);return n!=n&&(n=e),H(n)},H=function(t){return Math.min(Math.max(t,1e3),18e6)},$=function(t,e,n){try{"function"==typeof e&&e.call(t,n)}catch(t){O(t)}};function q(t,e){_.call(this),this.onopen=void 0,this.onmessage=void 0,this.onerror=void 0,this.url=void 0,this.readyState=void 0,this.withCredentials=void 0,this._close=void 0,this.status=0,function(t,e,s){e=String(e);var c=null!=s&&Boolean(s.withCredentials),a=H(1e3),u=null!=s&&null!=s.heartbeatTimeout?U(s.heartbeatTimeout,45e3):H(45e3),l="",f=a,p=!1,h=null!=s&&null!=s.headers?JSON.parse(JSON.stringify(s.headers)):void 0,d=null!=s&&null!=s.Transport?s.Transport:null!=o&&"withCredentials"in o.prototype||null==i?o:i,v=D&&(null==s||null==s.Transport&&!s.forceXhr)?void 0:new m(new d),y=null==v?new x:new w,g=void 0,C=0,b=T,_="",q="",B="",J="",z=M,G=0,V=0,X=function(e,n,r,o,i){if(t.status=e,b===S)if(g=i,200===e&&null!=r&&I.test(r)){b=A,p=!0,f=a,t.readyState=A;var s=new E("open",{status:e,statusText:n,headers:o});t.dispatchEvent(s),$(t,t.onopen,s)}else{var c="";200!==e?(n&&(n=n.replace(/\s+/g," ")),c="EventSource's response has a status "+e+" "+n+" that is not 200. Aborting the connection."):c="EventSource's response has a Content-Type specifying an unsupported type: "+(null==r?"-":r.replace(/\s+/g," "))+". Aborting the connection.",O(new Error(c)),W();s=new E("error",{status:e,statusText:n,headers:o});t.dispatchEvent(s),$(t,t.onerror,s)}},Z=function(e){if(b===A){for(var o=-1,i=0;i<e.length;i+=1){(h=e.charCodeAt(i))!=="\n".charCodeAt(0)&&h!=="\r".charCodeAt(0)||(o=i)}var s=(-1!==o?J:"")+e.slice(0,o+1);J=(-1===o?J:"")+e.slice(o+1),""!==s&&(p=!0);for(var c=0;c<s.length;c+=1){var h=s.charCodeAt(c);if(z===R&&h==="\n".charCodeAt(0))z=M;else if(z===R&&(z=M),h==="\r".charCodeAt(0)||h==="\n".charCodeAt(0)){if(z!==M){z===P&&(V=c+1);var d=s.slice(G,V-1),v=s.slice(V+(V<c&&s.charCodeAt(V)===" ".charCodeAt(0)?1:0),c);"data"===d?(_+="\n",_+=v):"id"===d?q=v:"event"===d?B=v:"retry"===d?(a=U(v,a),f=a):"heartbeatTimeout"===d&&(u=U(v,u),0!==C&&(r(C),C=n((function(){Q()}),u)))}if(z===M){if(""!==_){l=q,""===B&&(B="message");var y=new j(B,{data:_.slice(1),lastEventId:q});if(t.dispatchEvent(y),"message"===B&&$(t,t.onmessage,y),b===k)return}_="",B=""}z=h==="\r".charCodeAt(0)?R:M}else z===M&&(G=c,z=P),z===P?h===":".charCodeAt(0)&&(V=c+1,z=N):z===N&&(z=L)}}},K=function(){if(b===A||b===S){b=T,0!==C&&(r(C),C=0),C=n((function(){Q()}),f),f=H(Math.min(16*a,2*f)),t.readyState=S;var e=new F("error",{status:t.status});t.dispatchEvent(e),$(t,t.onerror,e)}},W=function(){b=k,null!=g&&(g(),g=void 0),0!==C&&(r(C),C=0),t.readyState=k},Q=function(){if(C=0,b===T){p=!1,C=n((function(){Q()}),u),b=S,_="",B="",q=l,J="",G=0,V=0,z=M;var t=e;"data:"!==e.slice(0,5)&&"blob:"!==e.slice(0,5)&&""!==l&&(t+=(-1===e.indexOf("?")?"?":"&")+"lastEventId="+encodeURIComponent(l));var r={Accept:"text/event-stream"};if(null!=h)for(var o in h)Object.prototype.hasOwnProperty.call(h,o)&&(r[o]=h[o]);try{y.open(v,X,Z,K,t,c,r)}catch(t){throw W(),t}}else p||null==g?(p=!1,C=n((function(){Q()}),u)):(O(new Error("No activity within "+u+" milliseconds. Reconnecting.")),g(),g=void 0)};t.url=e,t.readyState=S,t.withCredentials=c,t._close=W,Q()}(this,t,e)}var D=null!=a&&null!=u&&"body"in u.prototype;q.prototype=Object.create(_.prototype),q.prototype.CONNECTING=S,q.prototype.OPEN=A,q.prototype.CLOSED=k,q.prototype.close=function(){this._close()},q.CONNECTING=S,q.OPEN=A,q.CLOSED=k,q.prototype.withCredentials=void 0,t.exports=q},function(t,e){var n=9007199254740991,r="[object Arguments]",o="[object Function]",i="[object GeneratorFunction]",s=/^(?:0|[1-9]\d*)$/;function c(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)}var a,u,l=Object.prototype,f=l.hasOwnProperty,p=l.toString,h=l.propertyIsEnumerable,d=(a=Object.keys,u=Object,function(t){return a(u(t))}),v=Math.max,y=!h.call({valueOf:1},"valueOf");function m(t,e){var n=x(t)||function(t){return function(t){return function(t){return!!t&&"object"==typeof t}(t)&&_(t)}(t)&&f.call(t,"callee")&&(!h.call(t,"callee")||p.call(t)==r)}(t)?function(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r}(t.length,String):[],o=n.length,i=!!o;for(var s in t)!e&&!f.call(t,s)||i&&("length"==s||C(s,o))||n.push(s);return n}function g(t,e,n){var r=t[e];f.call(t,e)&&b(r,n)&&(void 0!==n||e in t)||(t[e]=n)}function C(t,e){return!!(e=null==e?n:e)&&("number"==typeof t||s.test(t))&&t>-1&&t%1==0&&t<e}function w(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||l)}function b(t,e){return t===e||t!=t&&e!=e}var x=Array.isArray;function _(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=n}(t.length)&&!function(t){var e=O(t)?p.call(t):"";return e==o||e==i}(t)}function O(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}var F,j=(F=function(t,e){if(y||w(e)||_(e))!function(t,e,n,r){n||(n={});for(var o=-1,i=e.length;++o<i;){var s=e[o],c=r?r(n[s],t[s],s,n,t):void 0;g(n,s,void 0===c?t[s]:c)}}(e,function(t){return _(t)?m(t):function(t){if(!w(t))return d(t);var e=[];for(var n in Object(t))f.call(t,n)&&"constructor"!=n&&e.push(n);return e}(t)}(e),t);else for(var n in e)f.call(e,n)&&g(t,n,e[n])},function(t,e){return e=v(void 0===e?t.length-1:e,0),function(){for(var n=arguments,r=-1,o=v(n.length-e,0),i=Array(o);++r<o;)i[r]=n[e+r];r=-1;for(var s=Array(e+1);++r<e;)s[r]=n[r];return s[e]=i,c(t,this,s)}}((function(t,e){var n=-1,r=e.length,o=r>1?e[r-1]:void 0,i=r>2?e[2]:void 0;for(o=F.length>3&&"function"==typeof o?(r--,o):void 0,i&&function(t,e,n){if(!O(n))return!1;var r=typeof e;return!!("number"==r?_(n)&&C(e,n.length):"string"==r&&e in n)&&b(n[e],t)}(e[0],e[1],i)&&(o=r<3?void 0:o,r=1),t=Object(t);++n<r;){var s=e[n];s&&F(t,s,n,o)}return t})));t.exports=j},function(t,e){function n(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}t.exports=n,n.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),n=Math.floor(e*this.jitter*t);t=0==(1&Math.floor(10*e))?t-n:t+n}return 0|Math.min(t,this.max)},n.prototype.reset=function(){this.attempts=0},n.prototype.setMin=function(t){this.ms=t},n.prototype.setMax=function(t){this.max=t},n.prototype.setJitter=function(t){this.jitter=t}}])}));
//# sourceMappingURL=sse.io-client.js.map
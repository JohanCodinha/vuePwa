"use strict";var precacheConfig=[["1d70c2d702c04f0967f0.worker.js","8cdb276eee86611ae94be4e6258201d4"],["4b49b2d2a90d49d181d7.worker.js","e517a4e5205528026de8e170aae136ee"],["c16085a3ec278478d230.worker.js","dcb4f8cbba5ba671825ba12142d44c06"],["index.html","12262018eac0421991f48a5010442ad2"],["server.js","994f7098367e1cd7695de79bdac6996d"],["service-worker.js","2a5a2953a6c6e51412a9721169d4b103"],["static/base.css","813d1cc901ca7eb55c2cfa250570d623"],["static/css/app.9642dda3985ce61adddeac0cd0f153bd.css","009b16afa77d6e93e24c9142510163a3"],["static/js/app.0afa0b4541da61bd5618.js","dd85ef72b763f3451540e1f67d778cdc"],["static/js/manifest.19258f2a3f16c24f97ea.js","7974283751d49974961af21999f65026"],["static/js/vendor.94cabf74b1e68c42a114.js","ceaa446ca622357c46bfdc659c19343e"],["static/reset.css","532505617424d514acc306fa940176ab"],["static/service-worker.js","63c2410e9a7d15bfb7b508627f00d775"]],cacheName="sw-precache-v3-my-vue-app-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var r=new URL(e);return"/"===r.pathname.slice(-1)&&(r.pathname+=t),r.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(t){return new Response(t,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,t,r,n){var a=new URL(e);return n&&a.pathname.match(n)||(a.search+=(a.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(r)),a.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var r=new URL(t).pathname;return e.some(function(e){return r.match(e)})},stripIgnoredUrlParameters=function(e,t){var r=new URL(e);return r.hash="",r.search=r.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return t.every(function(t){return!t.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),r.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],r=e[1],n=new URL(t,self.location),a=createCacheKey(n,hashParamName,r,!1);return[n.toString(),a]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(r){if(!t.has(r)){var n=new Request(r,{credentials:"same-origin"});return fetch(n).then(function(t){if(!t.ok)throw new Error("Request for "+r+" returned a response with status "+t.status);return cleanResponse(t).then(function(t){return e.put(r,t)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(r){return Promise.all(r.map(function(r){if(!t.has(r.url))return e.delete(r)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var t,r=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching),n="index.html";(t=urlsToCacheKeys.has(r))||(r=addDirectoryIndex(r,n),t=urlsToCacheKeys.has(r));0,t&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(r)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(t){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,t),fetch(e.request)}))}}),importScripts("/static/service-worker.js");
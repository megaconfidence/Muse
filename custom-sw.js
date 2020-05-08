/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js'
);
importScripts(
  'https://cdn.jsdelivr.net/npm/idb-keyval@3/dist/idb-keyval-iife.min.js'
);

// Init indexedDB using idb-keyval, https://github.com/jakearchibald/idb-keyval
const store = new idbKeyval.Store('GraphQL-Cache', 'PostResponses');

// Workbox with custom handler to use IndexedDB for cache.
workbox.routing.registerRoute(
  new RegExp('/graphql(/)?'),
  async ({ event }) => {
    return staleWhileRevalidate(event);
  },
  'POST'
);

const cacheName = 'MUSE_CACHE';
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) =>
        cache.addAll([
          '/image/muse.webp',
          '/image/songs.webp',
          '/image/icon/add_playlist.svg',
          '/image/icon/album.svg',
          '/image/icon/alert.svg',
          '/image/icon/all_songs.svg',
          '/image/icon/arrow_left.svg',
          '/image/icon/artist.svg',
          '/image/icon/cancel.svg',
          '/image/icon/car.svg',
          '/image/icon/caret_down.svg',
          '/image/icon/clock.svg',
          '/image/icon/close.svg',
          '/image/icon/edit.svg',
          '/image/icon/fire.svg',
          '/image/icon/folder.svg',
          '/image/icon/getSvg.js',
          '/image/icon/info.svg',
          '/image/icon/laptop.svg',
          '/image/icon/like.svg',
          '/image/icon/like_fill.svg',
          '/image/icon/list.svg',
          '/image/icon/loading.svg',
          '/image/icon/loading_2.svg',
          '/image/icon/menu.svg',
          '/image/icon/menu_fill.svg',
          '/image/icon/mobile.svg',
          '/image/icon/mute.svg',
          '/image/icon/next.svg',
          '/image/icon/no_repeat.svg',
          '/image/icon/pause.svg',
          '/image/icon/play.svg',
          '/image/icon/play_circle.svg',
          '/image/icon/play_circle4.svg',
          '/image/icon/playlist.svg',
          '/image/icon/plus.svg',
          '/image/icon/queue.svg',
          '/image/icon/remove.svg',
          '/image/icon/repeat.svg',
          '/image/icon/save.svg',
          '/image/icon/search.svg',
          '/image/icon/settings.svg',
          '/image/icon/share.svg',
          '/image/icon/sort.svg',
          '/image/icon/speakers.svg',
          '/image/icon/tag.svg',
          '/image/icon/tv.svg',
          '/image/icon/voice.svg',
          '/image/icon/volume.svg',
          '/image/icon/watch.svg',
        ])
      )
  );
});

// Return cached response when possible, and fetch new results from server in
// the background and update the cache.
self.addEventListener('fetch', async (event) => {
  if (event.request.method === 'POST' && event.request.url.includes('/graphql')) {
    event.respondWith(staleWhileRevalidate(event));
  } else if (!event.request.url.includes('myzcloud.pro/img/') && !event.request.url.includes('herokuapp') ) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        } else {
          const url = event.request.url;
          const res = fetch(event.request);
          if (
            url.includes('https://graph.facebook.com/') ||
            url.includes('https://lh3.googleusercontent.com/')
          ) {
            caches.open(cacheName).then((cache) => {
              return cache.add(url);
            });
          }
          return res;
        }
      })
    );
  }
});

async function staleWhileRevalidate(event) {
  let promise = null;
  let cachedResponse = await getCache(event.request.clone());
  let fetchPromise = fetch(event.request.clone())
    .then((response) => {
      setCache(event.request.clone(), response.clone());
      return response;
    })
    .catch((err) => {
      console.error(err);
    });
  return cachedResponse ? Promise.resolve(cachedResponse) : fetchPromise;
}

async function serializeResponse(response) {
  let serializedHeaders = {};
  for (let entry of response.headers.entries()) {
    serializedHeaders[entry[0]] = entry[1];
  }
  let serialized = {
    headers: serializedHeaders,
    status: response.status,
    statusText: response.statusText,
  };
  serialized.body = await response.json();
  return serialized;
}

async function setCache(request, response) {
  let key, data;
  let body = await request.json();
  let id = CryptoJS.MD5(body.query).toString();

  let entry = {
    query: body.query,
    response: await serializeResponse(response),
    timestamp: Date.now(),
  };
  idbKeyval.set(id, entry, store);
}

async function getCache(request) {
  let data;
  try {
    let body = await request.json();
    let id = CryptoJS.MD5(body.query).toString();
    data = await idbKeyval.get(id, store);
    if (!data) return null;

    // Check cache max age.
    let cacheControl = request.headers.get('Cache-Control');
    let maxAge = cacheControl ? parseInt(cacheControl.split('=')[1]) : 3600;
    if (Date.now() - data.timestamp > maxAge * 1000) {
      console.log(`Cache expired. Load from API endpoint.`);
      return null;
    }

    console.log(`Load response from cache.`);
    return new Response(JSON.stringify(data.response.body), data.response);
  } catch (err) {
    return null;
  }
}

async function getPostKey(request) {
  let body = await request.json();
  return JSON.stringify(body);
}

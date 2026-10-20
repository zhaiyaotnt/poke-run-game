const CACHE_NAME = "poke-run-two-step-setup-v32";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./game.js",
  "./manifest.webmanifest",
  "./assets/icons/poke-run-180.png",
  "./assets/icons/poke-run-192.png",
  "./assets/icons/poke-run-512.png",
  "./assets/players/aaron-avatar.png",
  "./assets/players/amelia-avatar.png",
  "./assets/environment/alpine-meadow-ground-v2.jpg",
  "./assets/pokemon-3d/25.png",
  "./assets/pokemon-3d/150.png",
  "./assets/trainer/go-protagonist-back-3d.png",
  "./assets/trainer/go-protagonist-male.png",
  "./assets/trainer/go-protagonist-walk-sheet.png"
];

const LATER_DEX = [
  152,153,154,155,156,157,158,159,160,172,174,175,176,196,197,
  249,250,251,280,281,282,382,383,384,385,386,446,447,448,468,
  470,471,475,483,484,487,493,570,571,643,644,646,656,657,658,
  700,716,717,722,723,724,791,792,810,811,812,813,814,815,816,
  817,818,888,889,906,907,908,909,910,911,912,913,914,1007,1008
];

const POKEMON_ASSETS = [
  ...Array.from({ length: 151 }, (_, index) => index + 1),
  ...LATER_DEX
].map(dex => `./assets/pokemon-3d/${dex}.png`);

async function cacheInBatches(urls, batchSize = 12) {
  const cache = await caches.open(CACHE_NAME);
  for (let index = 0; index < urls.length; index += batchSize) {
    const batch = urls.slice(index, index + batchSize);
    await Promise.allSettled(batch.map(async url => {
      const existing = await cache.match(url);
      if (!existing) await cache.add(url);
    }));
  }
}

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "CACHE_FULL_ROSTER") {
    event.waitUntil(cacheInBatches(POKEMON_ASSETS));
  }
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith((async () => {
    const requestUrl = new URL(event.request.url);
    const isCoreRequest = requestUrl.origin === self.location.origin && (
      event.request.mode === "navigate"
      || requestUrl.pathname.endsWith("/index.html")
      || requestUrl.pathname.endsWith("/game.js")
      || requestUrl.pathname.endsWith("/styles.css")
      || requestUrl.pathname.endsWith("/manifest.webmanifest")
    );

    const fetchAndCache = async () => {
      const response = await fetch(event.request);
      if (response && (response.ok || response.type === "opaque")) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
      }
      return response;
    };

    if (isCoreRequest) {
      try {
        return await fetchAndCache();
      } catch (error) {
        return (await caches.match(event.request)) || caches.match("./index.html");
      }
    }

    const cached = await caches.match(event.request);
    if (cached) return cached;

    try {
      return await fetchAndCache();
    } catch (error) {
      if (event.request.mode === "navigate") {
        return caches.match("./index.html");
      }
      throw error;
    }
  })());
});

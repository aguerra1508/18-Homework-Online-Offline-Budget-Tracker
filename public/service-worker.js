// Testing if service worker is being read
console.log("Hello from your service worker!");

// Cache variables
const staticCache = "static-cache-v2";
const dataCache = "data-cache-v1";

// Files to cache
const staticFilesToPreCache = [
  "/",
	"/index.js",
	"/db.js",
  "/index.html",
	"/manifest.webmanifest",
	"/styles.css",
	"/icons/icon-192x192.png",
	"/icons/icon-512x512.png"
];

// Install
self.addEventListener("install", (e) => {
  console.log("Service Worker Install");
  e.waitUntil(
    caches.open(staticCache).then((cache) => {
          console.log("Service Worker Caching all: app shell and content");
      return cache.addAll(staticFilesToPreCache);
    })
  );
});

// Activate
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== staticCache && key !== dataCache) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
          console.log("Service Worker Fetching resource: "+e.request.url);
      return r || fetch(e.request).then((response) => {
                return caches.open(staticCache).then((cache) => {
          console.log("Service Worker Caching new resource: "+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
const FILES_TO_CACHE = [
    "/",
    "/db.js",
    "/index.html",   
    "/index.js",   
    "/manifest.json",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
 
    
];

const DATA_CACHE_NAME = "data-cache-v1";
const CACHE_NAME = "static-cache-v2";

self.addEventListener("install", function (event) {

    event.waitUntil(
        allCache.open(CACHE_NAME).then((cache) => {

            console.log("Files are now pre-cached");

            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});



self.addEventListener("activate", function (event) {

    event.waitUntil(
        allCache.keys().then((allKeys) => {
            return Promise.all(
                allKeys.map((key) => {
                    if (key !== DATA_CACHE_NAME && key !== CACHE_NAME) {

                        console.log("Cached data deleted", key);

                        return allCache.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});


self.addEventListener("fetch", function (event) {
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            allCache
                .open(DATA_CACHE_NAME)
                .then((cache) => {
                    return fetch(event.request)
                        .then((response) => {
                            if (response.status === 200) {
                                cache.put(event.request.url, response.clone());
                            }
                            return response;
                        })
                        .catch((err) => {
                            return cache.match(event.request);
                        });
                })
                .catch((err) => console.log(err))
        );
        return;
    }
    event.respondWith(
        allCache.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});
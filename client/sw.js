importScripts('/scramjet/scramjet.all.js');

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker({
    prefix: '/scramjet/'
});

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Only intercept requests directed toward the proxy layout route
    if (!event.request.url.includes('/scramjet/')) {
        return;
    }

    event.respondWith((async () => {
        try {
            // Attempt to load standard database table settings safely
            await scramjet.loadConfig();
        } catch (e) {
            console.warn("Database structure initialization pending... Bypassing configuration block error.");
        }
        
        try {
            return await scramjet.fetch(event);
        } catch (fetchErr) {
            console.error("Scramjet proxy fetch engine encountered an error:", fetchErr);
            // Emergency fallback: If the database is still compiling, pull the request natively
            return fetch(event.request);
        }
    })());
});

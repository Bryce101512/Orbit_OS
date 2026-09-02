import "/baremux/index.js"; 

async function initializeProxy() {
    if ('serviceWorker' in navigator) {
        try {
            // 1. Force-delete the corrupted database shells programmatically before connecting
            await new Promise((resolve) => {
                const req = indexedDB.deleteDatabase("bare-mux");
                req.onsuccess = () => resolve();
                req.onerror = () => resolve();
                req.onblocked = () => resolve();
            });

            // 2. Register your Service Worker configuration rules
            await navigator.serviceWorker.register('/sw.js', {
                scope: '/scramjet/' 
            });

            // 3. Fire up the connection handler now that the database is clean
            const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
            const wispUrl = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/wisp/';
            
            await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
            
            console.log("Scramjet infrastructure configured and completely ready.");
        } catch (err) {
            console.error("Proxy registration failed:", err);
        }
    }
}

initializeProxy();

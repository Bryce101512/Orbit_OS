import "/baremux/index.js"; 

async function initializeProxy() {
    if ('serviceWorker' in navigator) {
        try {
            // 1. BULLETPROOF FIX: Universally scan and completely wipe ALL database shells before booting
            if (window.indexedDB && indexedDB.databases) {
                const dbs = await indexedDB.databases();
                for (let db of dbs) {
                    if (db.name) {
                        indexedDB.deleteDatabase(db.name);
                        console.log(`Purged stuck storage shell: ${db.name}`);
                    }
                }
            }

            // 2. Register your Service Worker configuration parameters
            await navigator.serviceWorker.register('/sw.js', {
                scope: '/scramjet/' 
            });

            // 3. Fire up the connection handler cleanly on an empty slate
            const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
            const wispUrl = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/wisp/';
            
            // Pass the string reference path layout straight to the setup container
            await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
            
            console.log("Scramjet infrastructure configured and completely ready.");
        } catch (err) {
            console.error("Proxy registration failed:", err);
        }
    }
}

initializeProxy();

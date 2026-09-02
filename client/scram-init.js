import "/baremux/index.js"; 

async function initializeProxy() {
    if ('serviceWorker' in navigator) {
        try {
            // 1. Explicitly initialize the native browser service worker structure
            await navigator.serviceWorker.register('/sw.js', {
                scope: '/scramjet/' 
            });

            // 2. Map the underlying BareMux communication handler
            const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
            const wispUrl = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/wisp/';
            
            // Fix: Pass the clean string reference path instead of a dynamic class object
            await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
            
            console.log("Scramjet infrastructure configured and completely ready.");
        } catch (err) {
            console.error("Proxy registration failed:", err);
        }
    }
}

initializeProxy();

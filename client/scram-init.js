import "/baremux/index.js";

const { ScramjetController } = $scramjetLoadController();

window.scramjetReady = initializeProxy();

async function initializeProxy() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/scramjet/'
            });
            await navigator.serviceWorker.ready;

            const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
            const wispUrl = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/wisp/';
            await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);

            const controller = new ScramjetController({ prefix: "/scramjet/" });
            await controller.init();
            window.scramjet = controller;
            return controller;
        } catch (err) {
            console.error("Proxy registration failed:", err);
            throw err;
        }
    }

    throw new Error("Service workers are not supported in this browser.");
}

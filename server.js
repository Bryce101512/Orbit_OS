import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { scramjetPath } from '@mercuryworkshop/scramjet/path';
import { server as wisp } from '@mercuryworkshop/wisp-js/server'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);

// 1. Setup Security Headers required for Scramjet WebAssembly routing
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

// 1. Map Scramjet Core Files (Make sure this says /scramjet/)
app.use('/scramjet/', express.static(scramjetPath));

// 2. Map Bare-Mux and Epoxy distribution assets
app.use('/baremux/', express.static(path.join(__dirname, 'node_modules/@mercuryworkshop/bare-mux/dist')));
app.use('/epoxy/', express.static(path.join(__dirname, 'node_modules/@mercuryworkshop/epoxy-transport/dist')));

// 3. Serve your main frontend pages from the 'client' folder
app.use(express.static(path.join(__dirname, 'client')));

app.get('/sw.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'sw.js'));
});

// 5. Serve your main frontend pages from the 'client' folder
app.use(express.static(path.join(__dirname, 'client')));

// 6. Handle Wisp protocol socket upgrades for the network backend
server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/wisp/')) {
        wisp.route(req, socket, head);
    } else {
        socket.end();
    }
});

// 7. Initialize server listener
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server successfully executing at http://localhost:${PORT}`);
});

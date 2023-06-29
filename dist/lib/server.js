import http from 'node:http';
import { file } from './file.js';
const server = {};
server.httpServer = http.createServer(async (req, res) => {
    const socket = req.socket;
    const encryption = socket.encryption;
    const ssl = encryption !== undefined ? 's' : '';
    const baseURL = `http${ssl}://${req.headers.host}`;
    const parsedURL = new URL(req.url ?? '', baseURL);
    const httpMethod = req.method ? req.method.toLowerCase() : 'get';
    const trimmedPath = parsedURL.pathname
        .replace(/^\/+|\/+$/g, '')
        .replace(/\/\/+/g, '/');
    const textFileExtensions = ['css', 'js', 'svg', 'webmanifest'];
    const binaryFileExtensions = ['png', 'jpg', 'jpeg', 'webp', 'ico', 'eot', 'ttf', 'woff', 'woff2', 'otf'];
    const fileExtension = trimmedPath.slice(trimmedPath.lastIndexOf('.') + 1);
    const isTextFile = textFileExtensions.includes(fileExtension);
    const isBinaryFile = binaryFileExtensions.includes(fileExtension);
    const isAPI = trimmedPath.startsWith('api/');
    const isPage = !isTextFile && !isBinaryFile && !isAPI;
    const MIMES = {
        html: 'text/html',
        css: 'text/css',
        js: 'text/javascript',
        json: 'application/json',
        txt: 'text/plain',
        svg: 'image/svg+xml',
        xml: 'application/xml',
        ico: 'image/vnd.microsoft.icon',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        woff2: 'font/woff2',
        woff: 'font/woff',
        ttf: 'font/ttf',
        webmanifest: 'application/manifest+json',
    };
    let responseContent = 'ERROR: neturiu tai ko tu nori...';
    if (isTextFile) {
        const [err, msg] = await file.readPublic(trimmedPath);
        res.writeHead(err ? 404 : 200, {
            'Content-Type': MIMES[fileExtension],
            'cache-control': `max-age=60`,
        });
        if (err) {
            responseContent = msg;
        }
        else {
            responseContent = msg;
        }
    }
    if (isBinaryFile) {
        const [err, msg] = await file.readPublicBinary(trimmedPath);
        res.writeHead(err ? 404 : 200, {
            'Content-Type': MIMES[fileExtension],
            'cache-control': `max-age=60`,
        });
        if (err) {
            responseContent = msg;
        }
        else {
            responseContent = msg;
        }
    }
    if (isAPI) {
        console.log('suveike...');
        const [err, msg] = await file.readPublicBinary(trimmedPath);
        res.writeHead(err ? 404 : 200, {
            'Content-Type': `application/json`,
            'cache-control': `max-age=60`,
        });
        if (err) {
            responseContent = msg;
        }
        else {
            responseContent = msg;
        }
        const content1 = {
            "id": 1,
            "name": "Antanas",
            "email": "antanas@antanavicius.lt",
            "password": "!zBahWxh@Ecb5bXh9TFy",
            "age": 33,
            "date": "2023-06-28"
        };
        const fileName = '8.json';
        const [err1, msg1] = await file.create('../data/user', fileName, content1);
        res.writeHead(err ? 404 : 200, {
            'Content-Type': `application/json`,
            'cache-control': `max-age=60`,
        });
        if (err1) {
            responseContent = msg1;
        }
        else {
            responseContent = msg1;
        }
        let fileResponse = await file.read('../data', trimmedPath + '[ID]');
    }
    if (isPage) {
        let fileResponse = await file.read('../pages', trimmedPath + '.html');
        let [err, msg] = fileResponse;
        if (err) {
            fileResponse = await file.read('../pages', '404.html');
            err = fileResponse[0];
            msg = fileResponse[1];
        }
        res.writeHead(err ? 404 : 200, {
            'Content-Type': MIMES.html,
        });
        responseContent = msg;
    }
    return res.end(responseContent);
});
server.init = () => {
    server.httpServer.listen(4410, () => {
        console.log('Serveris sukasi ant http://localhost:4410');
    });
};
export { server };

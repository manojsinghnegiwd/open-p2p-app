const http = require('http');
const express = require('express');
const { startPeerServer } = require('./peer/server');

const app = express();

app.get('/', (req, res, next) => res.send('Hello world!'));

const server = http.createServer(app);

server.listen(8000);

startPeerServer();

const rooms = []
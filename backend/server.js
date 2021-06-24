const http = require('http');
const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');

const { startPeerServer } = require('./peer/server');
const { startSocketServer } = require('./socket/server');
const Room = require('./Room/Room');

const app = express();

app.use(json())
app.use(cors())

app.get('/', (req, res, next) => res.send('Hello world!'));

const server = http.createServer(app);

server.listen(8001, '0.0.0.0');

// will consist of all our participants
const rooms = []

app.post('/rooms', (req, res) => {
    const { body } = req;
    const newRoom = new Room(body.author);
    rooms.push(newRoom)
    res.json({
        roomId: newRoom.roomId
    })
})

app.get('/rooms/:roomId', (req, res) => {
    const { params } = req;
    const room = rooms.find(existingRooms => existingRooms.roomId === params.roomId);
    res.json({ ...room })
})

app.post('/rooms/:roomId/join', (req, res) => {
    const { params, body } = req;
    const roomIndex = rooms.findIndex(existingRooms => existingRooms.roomId === params.roomId);
    
    let room = null;

    if (roomIndex > -1) {
        room = rooms[roomIndex]
        room.addParticipant(body.participant);
        rooms[roomIndex] = room
    }

    res.json({ ...room.getInfo() })
})

startPeerServer();
startSocketServer(server, rooms);

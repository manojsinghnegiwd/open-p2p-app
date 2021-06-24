const { Server } = require("socket.io");

const socketToPeerHashMap = {}

const startSocketServer = (server, rooms) => {
    const io = new Server(server, {
        cors: {
          origin: '*',
        }
    });
    
    io.on('connection', (socket) => {
        socket.emit('get:peerId')

        socket.on('send:peerId', (peerId) => {
            socketToPeerHashMap[socket.id] = peerId
        })
    
        socket.on('disconnect', () => {
            const peerId = socketToPeerHashMap[socket.id]
            io.emit("user:left", peerId)

            const roomIndex = rooms.findIndex(existingRoom => existingRoom.participants.includes(peerId));

            if (roomIndex > -1) {
                let room = rooms[roomIndex]
                room.removeParticipant(peerId);
                rooms[roomIndex] = room
            }
        })
    });
}

module.exports = {
    startSocketServer
}

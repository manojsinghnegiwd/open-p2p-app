const { Server } = require("socket.io");

const socketToPeerHashMap = {}

const startSocketServer = (server) => {
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
        })
    });
}

module.exports = {
    startSocketServer
}

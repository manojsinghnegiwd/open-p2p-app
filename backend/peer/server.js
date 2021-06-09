const { PeerServer } = require('peer');

module.exports = {
    startPeerServer: () => {
        const peerServer = PeerServer({ port: 9000, path: '/', proxied: true })
    }
}

const { v4 } = require("uuid");

class Room {
    participants = []
    roomId = null
    author = null

    constructor (author) {
        this.roomId = v4();
        this.author = author
    }

    addParticipant = (participantId) => {
        this.participants.push(participantId)
    }

    removeParticipant = (participantId) => {
        let index = this.participants.findIndex(
            (existingParticipantId) => existingParticipantId === participantId
        )

        if (index > -1) {
            this.participants.splice(index, 1)
        }
    }

    getInfo = () => ({
        participants: this.participants,
        roomId: this.roomId,
        author: this.author
    })
}

module.exports = Room
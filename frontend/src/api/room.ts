export const createRoomAPI = async (author: string) => {
    const rawResponse: Response = await fetch('http://localhost:8001/rooms', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ author })
    })

    const data = await rawResponse.json()
    return data
}

export const fetchRoomAPI = async (roomId: string) => {
    const rawResponse: Response = await fetch(`http://localhost:8001/rooms/${roomId}`, {
        method: 'GET',
    })

    const data = await rawResponse.json()
    return data
}

export const joinRoomAPI = async (roomId: string, participant: string) => {
    const rawResponse: Response = await fetch(`http://localhost:8001/rooms/${roomId}/join`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ participant })
    })

    const data = await rawResponse.json()
    return data
}

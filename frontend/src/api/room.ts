export const createRoomAPI = async (author: string) => {
    const rawResponse: Response = await fetch('http://localhost:8000/rooms', {
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
    const rawResponse: Response = await fetch(`http://localhost:8000/rooms/${roomId}`, {
        method: 'GET',
    })

    const data = await rawResponse.json()

    return data
}

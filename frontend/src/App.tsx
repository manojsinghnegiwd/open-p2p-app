import React, { useCallback, useEffect, useRef, useState } from 'react';
import PeerJS from 'peerjs';
import { v4 as uuidv4 } from 'uuid';
import {
  BrowserRouter,
  Switch,
  Route,
  RouteComponentProps
} from 'react-router-dom';

// views
import Landing from './views/Landing';
import Room, { RoomParams } from './views/Room';

// api
import { createRoomAPI } from './api/room';

function App() {
  const peerInstance = useRef<PeerJS | null>(null);

  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    const userId = uuidv4();

    // save peer instance into ref
    peerInstance.current = new PeerJS(userId, {
      host: 'localhost',
      port: 9000,
      path: '/',
      secure: false
    });

    peerInstance.current.on('open', (id) => {
      setCurrentUserId(id)
    })
  }, [])

  const createRoom = useCallback(async () => {
    try {
      const roomInformation = await createRoomAPI(currentUserId)
      console.log(roomInformation, 'roomInformation')
    } catch (error) {
      console.error(error)
    }
  }, [currentUserId]);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/">
          <Landing
            onCreateRoom={createRoom}
            currentUserId={currentUserId}
          />
        </Route>
        <Route path="/rooms/:roomId" component={(props: RouteComponentProps<RoomParams>) => <Room
            {...props}
            currentUserId={currentUserId}
            peerInstance={peerInstance.current}
          />
        }>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;

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
      host: (process.env as any).REACT_APP_BACKEND_PEER_HOST,
      port: (process.env as any).REACT_APP_BACKEND_PEER_PORT,
      path: '/',
      secure: false
    });

    peerInstance.current.on('open', (id) => {
      setCurrentUserId(id)
    })
  }, [])

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={(props: RouteComponentProps) => <Landing
            {...props}
            currentUserId={currentUserId}
          />
        }>
        </Route>
        <Route exact path="/rooms/:roomId" component={(props: RouteComponentProps<RoomParams>) => <Room
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

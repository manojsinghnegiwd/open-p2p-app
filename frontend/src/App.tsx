import React, { useEffect, useRef, useState } from 'react';
import PeerJS from 'peerjs';
import { v4 as uuidv4 } from 'uuid';
import {
  BrowserRouter,
  Switch,
  Route
} from 'react-router-dom';

import Landing from './views/Landing';

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

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/">
          <Landing
            currentUserId={currentUserId}
          />
        </Route>
        <Route path="/room/:id">
          <Landing
            currentUserId={currentUserId}
          />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;

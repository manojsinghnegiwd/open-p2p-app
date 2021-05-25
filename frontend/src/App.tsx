import React, { useEffect } from 'react';
import PeerJS from 'peerjs';
import './App.css';

function App() {
  useEffect(() => {
    const peer = new PeerJS(new Date().getTime().toString(), {
      host: 'localhost',
      port: 9000,
      path: '/peer'
    });
  }, [])

  return (
    <div className="App">
      
    </div>
  );
}

export default App;

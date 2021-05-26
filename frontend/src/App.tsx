import React, { useEffect, useRef, useState } from 'react';
import PeerJS from 'peerjs';
import './App.css';
import { getUserMediaPromise } from './utils/media';

function App() {
  const peerInstance = useRef<PeerJS | null>(null);
  const currentMediaStream = useRef<MediaStream | null>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const remoteUserVideoRef = useRef<HTMLVideoElement>(null);

  const [remoteUserId, setRemoteUserId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // save peer instance into ref
    peerInstance.current = new PeerJS(new Date().getTime().toString(), {
      host: 'localhost',
      port: 9000,
      path: '/peer'
    });

    peerInstance.current.on('open', (id) => {
      setUserId(id)
    })

    peerInstance.current.on('call', async (call: PeerJS.MediaConnection) => {
      if (!currentMediaStream.current) {
        return;
      }

      call.answer(currentMediaStream.current)

      call.on('stream', function(remoteStream) {
        if (remoteUserVideoRef.current) {
          remoteUserVideoRef.current.srcObject = remoteStream
          remoteUserVideoRef.current.play();
        }
      });

    });

    setCurrentUserVideo();
  }, [])

  const setCurrentUserVideo = async () => {
    if (!currentUserVideoRef.current) {
      return;
    }

    const mediaStream = await getUserMediaPromise({ video: true, audio: true });
    currentUserVideoRef.current.srcObject = mediaStream;
    currentUserVideoRef.current.play();

    currentMediaStream.current = mediaStream;
  }

  const call = async () => {
    if (!peerInstance.current || !currentMediaStream.current) {
      return;
    }

    const call = peerInstance.current.call(remoteUserId, currentMediaStream.current)

    call.on('stream', (remoteStream) => {
      if (remoteUserVideoRef.current) {
        remoteUserVideoRef.current.srcObject = remoteStream
        remoteUserVideoRef.current.play();
      }
    });
  }

  return (
    <div className="App">
      <h1>{userId}</h1>
      <input
        type="text"
        onChange={e => setRemoteUserId(e.target.value)}
        value={remoteUserId}
      />
      <button onClick={call}>Call</button>
      <div>
        <video ref={currentUserVideoRef} muted />
      </div>
      <div>
        <video ref={remoteUserVideoRef} />
      </div>
    </div>
  );
}

export default App;

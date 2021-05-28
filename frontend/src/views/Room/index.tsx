import React, { useEffect, useRef, useCallback } from 'react';
import Peer from 'peerjs';
import './App.css';
import { getUserMediaPromise } from '../../utils/media';
import { RouteComponentProps } from 'react-router';

interface RoomProps extends RouteComponentProps {
  peerInstance: Peer
  remoteUserId: string
}

const Room: React.FC<RoomProps> = ({
  peerInstance,
  remoteUserId,
  match,
}) => {
  const currentMediaStream = useRef<MediaStream | null>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const remoteUserVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    peerInstance.on('call', async (incomingCall: Peer.MediaConnection) => {
      if (!currentMediaStream.current) {
        return;
      }

      incomingCall.answer(currentMediaStream.current)

      incomingCall.on('stream', function(remoteStream) {
        if (remoteUserVideoRef.current) {
          remoteUserVideoRef.current.srcObject = remoteStream
          remoteUserVideoRef.current.play();
        }
      });
    });

    setCurrentUserVideo();
  }, [peerInstance])

  const setCurrentUserVideo = async () => {
    if (!currentUserVideoRef.current) {
      return;
    }

    const mediaStream = await getUserMediaPromise({ video: true, audio: true });
    currentUserVideoRef.current.srcObject = mediaStream;
    currentUserVideoRef.current.play();

    currentMediaStream.current = mediaStream;

    if (remoteUserId) {
      // after setting the video call the other user
      call();
    }
  }

  const call = useCallback(() => {
    if (!peerInstance || !currentMediaStream.current) {
      return;
    }

    const outgoingCall = peerInstance.call(remoteUserId, currentMediaStream.current)

    outgoingCall.on('stream', (remoteStream) => {
      if (remoteUserVideoRef.current) {
        remoteUserVideoRef.current.srcObject = remoteStream
        remoteUserVideoRef.current.play();
      }
    });
  }, []);

  return (
    <div className="Room">
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

export default Room;

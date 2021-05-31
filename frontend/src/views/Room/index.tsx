import React, { useEffect, useRef, useCallback } from 'react';
import Peer from 'peerjs';
import { getUserMediaPromise } from '../../utils/media';
import { RouteComponentProps } from 'react-router';
import { fetchRoomAPI, joinRoomAPI } from '../../api/room';

export interface RoomParams {
  roomId: string
}
interface RoomProps extends RouteComponentProps<RoomParams> {
  peerInstance: Peer | null
  currentUserId: string
}

const Room: React.FC<RoomProps> = ({
  peerInstance,
  currentUserId,
  match,
}) => {
  const currentMediaStream = useRef<MediaStream | null>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const remoteUserVideoRef = useRef<HTMLVideoElement>(null);

  const { params } = match;
  const { roomId } = params;

  useEffect(() => {
    if (!peerInstance) {
      return;
    }

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

  const setCurrentUserVideo = useCallback(async () => {
    if (!currentUserVideoRef.current) {
      return;
    }

    try {
      const mediaStream = await getUserMediaPromise({ video: true, audio: true });
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      currentMediaStream.current = mediaStream;

      await joinRoomAPI(roomId, currentUserId)
      await callEveryoneInTheRoom(roomId)
    } catch (error) {
      console.error(error)
    }
  }, [roomId, currentUserId])

  const callEveryoneInTheRoom = async (roomId: string) => {
    try {
      const roomInformation = await fetchRoomAPI(roomId)

      const { participants } = roomInformation;

      if (participants.length) {
        participants.forEach((participant: string) => call(participant))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const call = useCallback((remoteUserId) => {
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
      <div className="container has-text-centered	">
        <p className="mb-5 mt-5">
          <strong>RoomId: {roomId}</strong>
        </p>
        <div className="columns">
          <div className="column">
            <div className="box">
              <video ref={currentUserVideoRef} muted />
            </div>
          </div>
          <div className="column">
            <div className="box">
              <video ref={remoteUserVideoRef} muted />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Room;

import React, { useEffect, useRef, useCallback } from 'react';
import Peer from 'peerjs';
import { getUserMediaPromise } from '../../utils/media';
import { RouteComponentProps } from 'react-router';
import { fetchRoomAPI } from '../../api/room';

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

  useEffect(() => {
    if (roomId) {
      callEveryoneInTheRoom(roomId);
    }
  }, [roomId]);

  const setCurrentUserVideo = async () => {
    if (!currentUserVideoRef.current) {
      return;
    }

    const mediaStream = await getUserMediaPromise({ video: true, audio: true });
    currentUserVideoRef.current.srcObject = mediaStream;
    currentUserVideoRef.current.play();

    currentMediaStream.current = mediaStream;
  }

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

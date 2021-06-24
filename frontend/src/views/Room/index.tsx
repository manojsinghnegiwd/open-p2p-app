import React, { useEffect, useRef, useCallback, useState } from 'react';
import Peer from 'peerjs';
import io, { Socket } from 'socket.io-client';
import { getUserMediaPromise } from '../../utils/media';
import { RouteComponentProps } from 'react-router';
import { fetchRoomAPI, joinRoomAPI } from '../../api/room';
import RemoteUserVideo from '../../components/Room/RemoteUserVideo';
import BottomControls from '../../components/Room/BottomControls';

export interface RoomParams {
  roomId: string
}

interface Participant {
  userId: string,
  mediaStream: MediaStream | null
}
interface RoomProps extends RouteComponentProps<RoomParams> {
  peerInstance: Peer | null
  currentUserId: string
}

const Room: React.FC<RoomProps> = ({
  peerInstance,
  currentUserId,
  match,
  history
}) => {
  const currentMediaStream = useRef<MediaStream | null>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const socketInstance = useRef<Socket | null>(null);

  const [muted, setMuted] = useState<boolean>(false);
  const [videoMuted, setVideoMuted] = useState<boolean>(false);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const { params } = match;
  const { roomId } = params;

  const call = useCallback((userId): Promise<Participant | null> => {
    if (!peerInstance || !currentMediaStream.current) {
      return Promise.resolve(null);
    }

    const outgoingCall = peerInstance.call(userId, currentMediaStream.current)

    return new Promise((resolve) => {
      const streamListener = (remoteStream: MediaStream) => {
        const newParticipant: Participant = {
          userId,
          mediaStream: remoteStream
        }

        outgoingCall.off('stream', streamListener);
        resolve(newParticipant);
      }

      outgoingCall.on('stream', streamListener);
    })
}, [peerInstance]);

  const callEveryoneInTheRoom = useCallback(async (roomId: string) => {
    try {
      const roomInformation = await fetchRoomAPI(roomId)

      const { participants } = roomInformation;

      if (participants.length) {
        const participantCalls: Promise<Participant | null>[] = participants
          .filter((participant: string) => participant !== currentUserId)
          .map((participant: string) => call(participant))

        Promise.all(participantCalls)
          .then((values: (Participant | null)[]) => {
            const validParticipants = values.filter(value => value) as Participant[]
            setParticipants(validParticipants)
          })
      }
    } catch (error) {
      console.error(error)
    }
  }, [currentUserId, call])


  const setCurrentUserVideo = useCallback(async () => {
    if (!currentUserVideoRef.current) {
      return;
    }

    if (!currentUserId) {
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
  }, [roomId, currentUserId, callEveryoneInTheRoom])

  useEffect(() => {
    setCurrentUserVideo();
    socketInstance.current = io((process.env as any).REACT_APP_BACKEND_EXPRESS_HOST);

    socketInstance.current.on('get:peerId', () => {
      socketInstance?.current?.emit('send:peerId', currentUserId)
    })
  }, [currentUserId, setCurrentUserVideo])

  useEffect(() => {
    const userLeftListener = (peerId: string) => {
      const filteredParticipants = participants.filter(
        participant => participant.userId !== peerId
      )

      setParticipants(filteredParticipants)
    }

    socketInstance?.current?.on('user:left', userLeftListener)

    return () => {
      socketInstance?.current?.off('user:left', userLeftListener)
    }
  }, [participants])

  useEffect(() => {
    if (!peerInstance) {
      return;
    }

    const incomingCallListener = async (incomingCall: Peer.MediaConnection) => {
      if (!currentMediaStream.current) {
        return;
      }

      incomingCall.answer(currentMediaStream.current)

      incomingCall.on('stream', function(remoteStream) {
        const newParticipant: Participant = {
          userId: incomingCall.peer,
          mediaStream: remoteStream
        }

        setParticipants(participants.concat(newParticipant));
      });
    }

    peerInstance.on('call', incomingCallListener);

    return () => peerInstance.off('call', incomingCallListener)
  }, [peerInstance, participants])

  useEffect(() => {
    if (!currentMediaStream.current) {
      return;
    }

    const videoTracks = currentMediaStream.current.getVideoTracks();

    if (videoTracks[0]) {
      videoTracks[0].enabled = !videoMuted
    }

  }, [videoMuted])

  useEffect(() => {
    if (!currentMediaStream.current) {
      return;
    }

    const audioTracks = currentMediaStream.current.getAudioTracks();

    if (audioTracks[0]) {
      audioTracks[0].enabled = !muted
    }

  }, [muted])

  return (
    <div className="Room">
      <div className="container has-text-centered	">
        <p className="mb-5 mt-5">
          <strong>RoomId: {roomId}</strong>
        </p>
        <div className="columns">
          <div className="column">
            <video ref={currentUserVideoRef} muted/>
          </div>
          {
            participants.map(
              participant => (
                <RemoteUserVideo
                  key={participant.userId}
                  remoteStream={participant.mediaStream}
                />
              )
            )
          }
        </div>
      </div>
      <BottomControls
        onLeave={() => {
          socketInstance?.current?.disconnect()
          history.push(`/`)
        }}
        toggleMute={() => setMuted(!muted)}
        toggleVideoMute={() => setVideoMuted(!videoMuted)}
        muted={muted}
        videoMuted={videoMuted}
      />
    </div>
  );
}

export default Room;

import React, { useEffect, useRef, useCallback, useState } from 'react';
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
  history
}) => {
  const currentMediaStream = useRef<MediaStream | null>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const remoteUserVideoRef = useRef<HTMLVideoElement>(null);

  const [muted, setMuted] = useState<boolean>(false);
  const [videoMuted, setVideoMuted] = useState<boolean>(false);

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
              <video ref={currentUserVideoRef} muted/>
            </div>
          </div>
          <div className="column">
            <div className="box">
              <video ref={remoteUserVideoRef} />
            </div>
          </div>
        </div>
      </div>
      <div className="has-text-centered mt-5">
        <button className="button is-danger mr-2" onClick={() => history.push(`/`)}>
          <span className="icon">
            <i className="fas fa-phone-slash"/>
          </span>
          <span>Leave call</span>
        </button>
        <button className={`button is-${muted ? 'danger' : 'primary' } mr-2`} onClick={() => setMuted(!muted)}>
          <span className="icon">
            <i className={`fas ${muted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
          </span>
          <span>{muted ? 'Unmute' : 'Mute'}</span>
        </button>
        <button className={`button is-${videoMuted ? 'danger' : 'primary' } mr-2`} onClick={() => setVideoMuted(!videoMuted)}>
          <span className="icon">
            <i className={`fas ${videoMuted ? 'fa-video-slash' : 'fa-video'}`}></i>
          </span>
          <span>{videoMuted ? 'Turn video on' : 'Turn video off'}</span>
        </button>
      </div>
    </div>
  );
}

export default Room;

import Peer from "peerjs";
import React, { useCallback } from "react";
import { RouteComponentProps } from "react-router";
import { createRoomAPI } from "../../api/room";

interface LandingProps extends RouteComponentProps {
  currentUserId: string
}

const Landing: React.FC<LandingProps> = ({ currentUserId, history }) => {

  const createRoom = useCallback(async () => {
    try {
      const roomInformation = await createRoomAPI(currentUserId)
      history.push(`/rooms/${roomInformation.roomId}`)
    } catch (error) {
      console.error(error)
    }
  }, [currentUserId]);

  return (
    <div className="container pt-5">
      <div className="columns">
        <div className="column is-half is-offset-one-quarter">
          <p className="mb-5">
            <strong>Hey There !!! Your User ID is {currentUserId}</strong>
          </p>
          <button onClick={createRoom} className="button is-success is-fullwidth">Create a room</button>
        </div>
      </div>
    </div>
  );
};

export default Landing;

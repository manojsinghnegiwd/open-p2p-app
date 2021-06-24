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
  }, [currentUserId, history]);

  return (
    <div className="container pt-5">
      <div className="columns">
        <div className="column is-half is-offset-one-quarter has-text-centered">
          <p className="mb-5 is-size-1 has-text-centered">
            <strong className="has-text-white">Open P2P App</strong>
          </p>
          <button onClick={createRoom} className="button is-success">Create a room</button>
          <p className="mt-5 is-size-5 has-text-centered">
            <strong className="has-text-white">Built with <i style={{ color: 'red' }} className="fas fa-heart"></i> by <a href="https://github.com/manojsinghnegiwd">Manoj Singh Negi</a></strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;

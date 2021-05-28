import Peer from "peerjs";
import React from "react";

interface LandingProps {
  currentUserId: string
}

const Landing: React.FC<LandingProps> = ({ currentUserId }) => {
  return (
    <div className="container pt-5">
      <div className="columns">
        <div className="column is-half is-offset-one-quarter">
          <p className="mb-5">
            <strong>Hey There !!! Your User ID is {currentUserId}</strong>
          </p>
          <button className="button is-success is-fullwidth">Create a room</button>
        </div>
      </div>
    </div>
  );
};

export default Landing;

import React from "react";

interface LandingProps {
  currentUserId: string;
}

const Landing: React.FC<LandingProps> = ({ currentUserId }) => {
  return (
    <div className="container pt-5">
      <div className="columns">
        <div className="column is-half is-offset-one-quarter">
          <p className="mb-5">
            <strong>Hey There !!! Your User ID is {currentUserId}</strong>
          </p>
          <div className="field">
              <p className="control">
                  <input className="input" type="text" placeholder="Remote User ID" />
              </p>
          </div>
          <button className="button is-success is-fullwidth">Join</button>
        </div>
      </div>
    </div>
  );
};

export default Landing;

import React from "react";
import Tilt from "react-parallax-tilt";
import "./Logo.css";
import brain from "./brainIcon.png";

const Logo = () => {
  return (
    <div
      className="ma4 mt0"
      style={{ display: "flex", justifyContent: "flex-start" }}
    >
      <Tilt
        tiltMaxAngleX={50}
        tiltMaxAngleY={50}
        className="Tilt br2 shadow-2"
        style={{ display: "inline-block" }}
      >
        <div>
          <img src={brain} alt="logo" style={{ padding: "10px" }} />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;

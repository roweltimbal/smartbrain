import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, displayImage }) => {
  return (
    <div className="center ma">
      <div className={`${displayImage ? "" : "display-none"} absolute mt2`}>
        <img alt="an image" src={imageUrl} width={"500px"} height={"auto"} />
      </div>
    </div>
  );
};

export default FaceRecognition;

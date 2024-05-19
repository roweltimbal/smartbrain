import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, displayImage, box }) => {
  return (
    <div className="center ma">
      <div className={`${displayImage ? "" : "display-none"} absolute mt2`}>
        <img
          id="inputimage"
          alt="an image"
          src={imageUrl}
          width={"500px"}
          height={"auto"}
        />
        <div
          className="bounding-box"
          style={{
            top: box.topRow,
            right: box.rightCol,
            bottom: box.bottomRow,
            left: box.leftCol,
          }}
        ></div>
      </div>
    </div>
  );
};

export default FaceRecognition;

import React from "react";
import { Fragment } from "react";
import Shapes from "./Shapes";
import "../App.css";

const ShapeList = [
  {
    id: "square",
    src: "/icons/square.png",
  },
  {
    id: "triangle",
    src: "/icons/triangle.png",
  },
  {
    id: "circle",
    src: "/icons/circle.png",
  },
];

function Dnd() {
  return (
    <Fragment>
      <div className="Shapes">
        {ShapeList.map((shape) => {
          return <Shapes src={shape.src} id={shape.id}></Shapes>;
        })}
      </div>
      <div className="Canvas"></div>
    </Fragment>
  );
}

export default Dnd;

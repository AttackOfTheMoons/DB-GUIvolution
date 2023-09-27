import React, { useState } from "react";
import { Fragment } from "react";
import Shapes from "./Shapes";
import { useDrop } from "react-dnd";
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
  const [canvas, setCanvas] = useState([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "shape",
    drop: (item) => putShape(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const putShape = (id) => {
    console.log(id);
    const shapeList = ShapeList.filter((shape) => id === shape.id);
    setCanvas((canvas) => [...canvas, shapeList[0]]);
  };

  return (
    <Fragment>
      <div className="Shapes">
        {ShapeList.map((shape) => {
          return <Shapes src={shape.src} id={shape.id}></Shapes>;
        })}
      </div>
      <div className="Canvas" ref={drop}>
        {canvas.map((shape) => {
          return <Shapes src={shape.src} id={shape.id}></Shapes>;
        })}
      </div>
    </Fragment>
  );
}

export default Dnd;

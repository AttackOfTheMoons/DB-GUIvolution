import React, { useState } from "react";
import { Fragment } from "react";
import Shapes from "./Shapes";
import { useDrop } from "react-dnd";
import { v4 as uuidv4 } from "uuid";
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
    const shapeList = ShapeList.find((shape) => id === shape.id);
    if (shapeList) {
      const instanceId = uuidv4(); // Generate a unique ID
      setCanvas((canvas) => [...canvas, { ...shapeList, instanceId }]);
    }
  };

  const removeShape = (id) => {
    setCanvas((canvas) => canvas.filter((shape) => shape.instanceId !== id));
  };

  return (
    <Fragment>
      <div className="Shapes">
        {ShapeList.map((shape) => {
          return <Shapes src={shape.src} id={shape.id}></Shapes>;
        })}
      </div>
      <div className={`Canvas`} ref={drop}>
        {canvas.map((shape) => {
          return (
            <Shapes
              src={shape.src}
              id={shape.id}
              instanceId={shape.instanceId}
              onRemove={() => removeShape(shape.instanceId)}
            ></Shapes>
          );
        })}
      </div>
    </Fragment>
  );
}

export default Dnd;

import React from "react";
import { useDrag } from "react-dnd";

function Shapes({ id, src }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "shape",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return (
    <img
      ref={drag}
      src={src}
      width="150px"
      alt=""
      style={{ border: isDragging ? "5px solid #fab22e" : "0px" }}
    ></img>
  );
}

export default Shapes;

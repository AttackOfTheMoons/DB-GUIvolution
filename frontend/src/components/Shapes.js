import React from "react";
import { useDrag } from "react-dnd";

function Shapes({ id, src, key, onRemove, instanceId }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "shape",
    item: { id: id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleClick = () => {
    onRemove(instanceId);
  };

  return (
    <img
      ref={drag}
      src={src}
      width="150px"
      alt=""
      style={{ border: isDragging ? "5px solid #fab22e" : "0px" }}
      onClick={handleClick}
    ></img>
  );
}

export default Shapes;

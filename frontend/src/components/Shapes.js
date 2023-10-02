import React, { Fragment } from "react";
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

  const shapeLabels = {
    square: "Select",
    triangle: "From",
    circle: "Where",
  };

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Display the shape image */}
      <img
        ref={drag}
        src={src}
        width="150px"
        alt=""
        style={{ border: isDragging ? "5px solid #fab22e" : "0px" }}
        onClick={handleClick}
      />

      {/* Display the shape label */}
      <div style={{ textAlign: "center", marginTop: "5px" }}>
        {shapeLabels[id]}
      </div>
    </div>
  );
}

export default Shapes;

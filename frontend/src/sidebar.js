import React from "react";

export default () => {
	const onDragStart = (event, nodeType) => {
		event.dataTransfer.setData("application/reactflow", nodeType);
		event.dataTransfer.effectAllowed = "move";
	};

	return (
		<aside>
			<div className="description">
				Drag these nodes to the canvas to the left.
			</div>
			{/* <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, "input")}
        draggable
      >
        Input Node
      </div> */}
			<div
				className="dndnode"
				onDragStart={(event) => onDragStart(event, "select")}
				draggable
			>
				<img alt="" src="./icons/triangle.png" width={"20px"} />
				SELECT
			</div>
			<div
				className="dndnode"
				onDragStart={(event) => onDragStart(event, "from")}
				draggable
			>
				<img alt="" src="./icons/square.png" width={"20px"} />
				FROM
			</div>
			<div
				className="dndnode"
				onDragStart={(event) => onDragStart(event, "where")}
				draggable
			>
				<img alt="" src="./icons/circle.png" width={"20px"} />
				WHERE
			</div>
			{/* <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, "output")}
        draggable
      >
        Output Node
      </div> */}
		</aside>
	);
};

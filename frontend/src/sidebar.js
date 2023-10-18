import React from "react";

const Sidebar = () => {
	const onDragStart = (event, nodeType) => {
		event.dataTransfer.setData("application/reactflow", nodeType);
		event.dataTransfer.effectAllowed = "move";
	};

	return (
		<aside>
			<div className="description">
				Drag these nodes to the canvas to the left.
			</div>

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
		</aside>
	);
};

export default Sidebar;

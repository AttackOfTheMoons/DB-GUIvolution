import React, { useState } from "react";

import "./sidebar.css";

const description = {
	color: "#fff", // Modern color
	fontFamily: "Arial, Helvetica, sans-serif", // Updated font stack
	fontWeight: "bold",
	letterSpacing: "0.5px", // Subtle letter spacing
	lineHeight: "1.2", // Increased line height for readability
	textAlign: "center",
	fontSize: "18px", // Slightly reduced font size for a modern, clean look
};

const Sidebar = () => {
	const onDragStart = (event, nodeType) => {
		event.dataTransfer.setData("application/reactflow", nodeType);
		event.dataTransfer.effectAllowed = "move";
	};

	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<>
			<button
				type="button"
				className="toggle-button toolbox-button"
				onClick={toggleSidebar}
			>
				{isSidebarOpen ? "🧰: ✅" : "🧰: ❌"}
			</button>
			<aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
				<div className="description" style={description}>
					<span className="toolbox-icon">🧰</span> SQL Query Toolbox
				</div>
				<div
					className="dndnode sidebar-select"
					onDragStart={(event) => onDragStart(event, "select")}
					draggable
				>
					<img alt="" src="./icons/parallelogram.png" width={"20px"} />
					SELECT
				</div>
				<div
					className="dndnode sidebar-from"
					onDragStart={(event) => onDragStart(event, "from")}
					draggable
				>
					<img alt="" src="./icons/square.png" width={"20px"} />
					FROM
				</div>
				<div
					className="dndnode sidebar-where"
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
		</>
	);
};

export default Sidebar;

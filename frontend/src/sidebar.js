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
	const [isHovered, setIsHovered] = useState(false);
	const toggleHover = () => {
		setIsHovered(!isHovered);
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<>
			<aside
				className={`sidebar ${isSidebarOpen ? "open" : ""}`}
				onClick={toggleSidebar}
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						toggleSidebar();
					}
				}}
			>
				<div className="description" style={description}>
					<span className="toolbox-icon">🧰</span> SQL Query Toolbox
				</div>
				<div
					className="dndnode sidebar-select"
					onDragStart={(event) => onDragStart(event, "select")}
					draggable
					onMouseEnter={toggleHover}
					onMouseLeave={toggleHover}
				>
					<img alt="" src="./icons/parallelogram.png" width={"20px"} />
					SELECT
					<span className={`hand-icon ${isHovered ? "isHovered" : ""}`}>🖐</span>
				</div>
				<div
					className="dndnode sidebar-from"
					onDragStart={(event) => onDragStart(event, "from")}
					draggable
					onMouseEnter={toggleHover}
					onMouseLeave={toggleHover}
				>
					<img alt="" src="./icons/square.png" width={"20px"} />
					FROM
					<span className={`hand-icon ${isHovered ? "isHovered" : ""}`}>🖐</span>
				</div>
				<div
					className="dndnode sidebar-where"
					onDragStart={(event) => onDragStart(event, "where")}
					draggable
					onMouseEnter={toggleHover}
					onMouseLeave={toggleHover}
				>
					<img alt="" src="./icons/circle.png" width={"20px"} />
					WHERE
					<span className={`hand-icon ${isHovered ? "isHovered" : ""}`}>🖐</span>
				</div>
			</aside>
		</>
	);
};

export default Sidebar;

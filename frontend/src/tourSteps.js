import React from "react";

export default [
	{
		content: <h2>Would you like to learn how to use the APP?</h2>,
		locale: { skip: <strong>SKIP</strong> },
		placement: "center",
		target: "body",
	},
	{
		content: <h2>Drag and drop a node to the canvas.</h2>,
		placement: "left",
		target: ".sidebar",
		title: "SQL Query Toolbox",
	},
	{
		content: <h2>First things first, use a FROM to select the table.</h2>,
		placement: "left",
		target: ".sidebar-from",
		title: "FROM",
	},
	{
		content: <h2>Then, you might use a SELECT to filter the columns.</h2>,
		placement: "left",
		target: ".sidebar-select",
		title: "SELECT",
	},
	{
		content: <h2>Also, you might use a WHERE to filter the rows.</h2>,
		placement: "left",
		target: ".sidebar-where",
		title: "WHERE",
	},
	{
		content: (
			<h2>
				You will need to connect SELECT-FROM-WHERE to have them work together.
			</h2>
		),
		placement: "center",
		target: "body",
		title: "Be Aware",
	},
	{
		content: <h2>Click a node and press "Backspace" to delete it.</h2>,
		placement: "center",
		target: "body",
		title: "Delete Nodes",
	},
	{
		content: <h2>Your data table is in the output window!</h2>,
		placement: "left",
		target: "#outputWindow",
		title: "Output",
	},
	{
		content: (
			<h2>Use this button to open/close the toolbox to see the output.</h2>
		),
		placement: "left",
		target: ".toolbox-button",
		title: "Open/Close",
	},
	{
		content: (
			<h2>
				You can even ask the AI to give you the SQL query for your desired
				content.
			</h2>
		),
		placement: "right",
		target: ".cs-chat-container",
		title: "AI",
	},
	{
		content: <h2>You are good to go!</h2>,
		placement: "center",
		target: "body",
		title: "Congrats!",
	},
];

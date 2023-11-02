import React from "react";

const tourSteps = [
	{
		content: <h2>Would you like to learn how to use the APP?</h2>,
		locale: { skip: <strong>SKIP</strong> },
		placement: "center",
		target: "body",
		title: "Welcome",
	},
	{
		content: <h2>Drag and drop a node to the canvas.</h2>,
		placement: "bottom",
		target: ".sidebar",
		title: "Drag and Drop Nodes",
	},
	{
		content: <h2>First things first, use a FROM to select the table.</h2>,
		placement: "left",
		target: ".sidebar-from",
		title: "Using the FROM Clause",
	},
	{
		content: <h2>Then, you might use a SELECT to filter the columns.</h2>,
		placement: "left",
		target: ".sidebar-select",
		title: "Working with the SELECT Clause",
	},
	{
		content: <h2>Also, you might use a WHERE to filter the rows.</h2>,
		placement: "left",
		target: ".sidebar-where",
		title: "Filtering Rows with the WHERE Clause",
	},
	{
		content: (
			<h2>
				You will need to connect SELECT-FROM-WHERE to have them work together.
			</h2>
		),
		placement: "center",
		target: "body",
		title: "Understanding Query Structure",
	},
	{
		content: <h2>Click a node and press "Backspace" to delete it.</h2>,
		placement: "center",
		target: "body",
		title: "Deleting Nodes",
	},
	{
		content: <h2>Click on this window to display the output table.</h2>,
		placement: "top",
		target: "#outputWindow",
		title: "Viewing Output",
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
		title: "Interacting with AI",
	},
	{
		content: <h2>You are good to go!</h2>,
		placement: "center",
		target: "body",
		title: "Congrats!",
	},
];

export default tourSteps;

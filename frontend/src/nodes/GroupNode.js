import React from "react";
import { ReactFlowProvider, useStoreApi } from "reactflow";

const GroupNode = ({ children }) => {
	const store = useStoreApi();

	const selectedNodes = store
		.getState()
		.getNodes()
		.filter((node) => node.selected);
	console.log("fuck: ", selectedNodes);

	const handleMove = (event, delta) => {
		console.log(store);
		store.getState().updateNodePositions(
			selectedNodes.map((node) => {
				try {
					return {
						...node,
						position: {
							x: node.position.x + delta.x,
							y: node.position.y + delta.y,
						},
					};
				} catch (error) {
					console.log(error);
				}
				return node;
			}),
		);
	};

	return (
		<ReactFlowProvider>
			<div
				style={{
					position: "absolute",
					// left: selectedNodes[0].position.x,
					// top: selectedNodes[0].position.y,
					// width: selectedNodes[0].width,
					// height: selectedNodes[0].height,
					border: "2px solid blue",
				}}
				onMouseDown={(event) => event.stopPropagation()}
				onMouseMove={handleMove}
			>
				{children}
			</div>
		</ReactFlowProvider>
	);
};

export default GroupNode;

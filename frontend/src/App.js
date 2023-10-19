import React, { useCallback, useRef, useState } from "react";
import ReactFlow, {
	Background,
	Controls,
	MiniMap,
	Panel,
	ReactFlowProvider,
	addEdge,
	useEdgesState,
	useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import styled from "styled-components";
import DynamicChatbot from "./chatbot";
import FromNode from "./nodes/FromNode";
import "./nodes/FromNode.css";
import SelectNode from "./nodes/SelectNode";
import "./nodes/SelectNode.css";
import WhereNode from "./nodes/WhereNode";
import "./nodes/WhereNode.css";
import Sidebar from "./sidebar";

import "./index.css";

let id = 0;
const getId = () => `dndnode_${id++}`;

const App = () => {
	const reactFlowWrapper = useRef(null);
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);

	const onConnect = useCallback(
		(params) => setEdges((eds) => addEdge(params, eds)),
		[],
	);

	const onDragOver = useCallback((event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const onDrop = useCallback(
		(event) => {
			event.preventDefault();

			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
			const type = event.dataTransfer.getData("application/reactflow");

			// check if the dropped element is valid
			if (typeof type === "undefined" || !type) {
				return;
			}

			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			});

			const newNode = {
				id: getId(),
				type,
				position,
				data: { label: `${type}` },
			};

			setNodes((nds) => nds.concat(newNode));
		},
		[reactFlowInstance],
	);

	const [variant, setVariant] = useState("lines");

	return (
		<div className="dndflow">
			<DynamicChatbot />
			<ReactFlowProvider>
				<div className="reactflow-wrapper" ref={reactFlowWrapper}>
					<ReactFlow
						nodes={nodes}
						edges={edges}
						nodeTypes={nodeTypes}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						onInit={setReactFlowInstance}
						onDrop={onDrop}
						onDragOver={onDragOver}
						fitView
					>
						<Controls />
						<Background color="#1e1ec9" variant={variant} gap={20} />
						<Panel>
							<button type="button" onClick={() => setVariant("dots")}>
								DOT
							</button>
							<button type="button" onClick={() => setVariant("lines")}>
								LINE
							</button>
							<button type="button" onClick={() => setVariant("cross")}>
								CROSS
							</button>
						</Panel>
					</ReactFlow>
				</div>
				<Sidebar />
			</ReactFlowProvider>
		</div>
	);
};

/* NODE TYPES */
const nodeTypes = { select: SelectNode, where: WhereNode, from: FromNode };

export default App;

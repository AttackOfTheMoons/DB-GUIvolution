import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
	Background,
	Controls,
	MiniMap,
	Panel,
	ReactFlowProvider,
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import styled from "styled-components";
import DynamicChatbot from "./chatbot";
import FromNode from "./nodes/FromNode";
import "./nodes/FromNode.css";
import SelectNode from "./nodes/SelectNode";
import "./nodes/SelectNode.css";
import { TableSelectionProvider } from "./nodes/TableSelectionContext";
import WhereNode from "./nodes/WhereNode";
import "./nodes/WhereNode.css";
import Sidebar from "./sidebar";

import axios from "axios";
import ResultTable from "./ResultTable";
import "./index.css";

const reactFlowStyle = {
	background: "#192655",
};

const ignoreChangeTypes = ["dimensions", "position", "select"];

const App = () => {
	const reactFlowWrapper = useRef(null);
	const [nodes, setNodes] = useState([]);
	// This will be where we store the compared_value that gets sent to the server.
	const [nodeData, setNodeData] = useState([]);
	const [edges, setEdges] = useState([]);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);
	const [resultKeys, setResultKeys] = useState([]);
	const [resultData, setResultData] = useState([]);

	const idRef = useRef(0);

	const getId = () => {
		const newId = `dndnode_${idRef.current}`;
		idRef.current++;

		return newId;
	};

	const onNodesChange = useCallback(
		(changes) => {
			const updatedNodes = applyNodeChanges(changes, nodes);
			for (const { type, id } of changes) {
				if (type === "remove") {
					setNodeData((prevNodes) =>
						prevNodes.filter((node) => node.id !== id),
					);
				}
			}
			setNodes(updatedNodes);
		},
		[nodes],
	);

	useEffect(() => {
		// TODO: All nodes are treated as connected, this should be fixed.
		axios
			.post("/queries/", { nodes: nodeData, flavor: "postgres" })
			.then((response) => {
				const data = response.data;
				if (!data) {
					console.error("Unexpected response from server?");
				}
				setResultKeys(data.keys);
				setResultData(data.data);
			})
			.catch((error) => {
				const errorData = error.response.data;
				// These errors shouldn't happen tm
				if (!errorData || !errorData.detail) {
					console.error("Unhandled server error.");
					return;
				}
				// TODO: These errors we should display to the user.
				if (Array.isArray(errorData.detail)) {
					errorData.detail.forEach((err) => console.log(err.msg));
				} else {
					console.log(errorData.detail);
				}
			});
	}, [nodeData]);

	const onEdgesChange = useCallback(
		(changes) => {
			const updatedEdges = applyEdgeChanges(changes, edges);
			setEdges(updatedEdges);
		},
		[edges],
	);

	const onConnect = useCallback(
		(params) => setEdges((prevEdges) => addEdge(params, prevEdges)),
		[],
	);

	const onDragOver = useCallback((event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const handleSubNodeValueChange = useCallback(
		(nodeId, newValue) => {
			setNodes((prevNodes) =>
				prevNodes.map((node) =>
					node.id === nodeId
						? { ...node, data: { ...node.data, nodeValue: newValue } }
						: node,
				),
			);
			setNodeData((prevDataNodes) =>
				prevDataNodes.map((node) =>
					node.id === nodeId ? { ...node, value: newValue } : node,
				),
			);
		},
		[setNodes, setNodeData],
	);

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

			let initialValue;

			switch (type) {
				case "from":
				case "where":
					initialValue = "";
					break;
				case "select":
					initialValue = [];
					break;
				default:
					initialValue = "";
			}
			const nodeId = getId();

			const nodeChange = (newValue) => {
				handleSubNodeValueChange(nodeId, newValue);
			};

			const newNode = {
				id: nodeId,
				type,
				position,
				data: {
					label: `${type}`,
					nodeValue: initialValue,
					handleNodeValueChange: nodeChange,
				},
			};

			const newDataNode = {
				id: nodeId,
				type,
				value: initialValue,
			};

			setNodes((prevNodes) => prevNodes.concat(newNode));
			setNodeData((prevNodeData) => prevNodeData.concat(newDataNode));
		},
		[reactFlowInstance],
	);

	const [variant, setVariant] = useState("lines");

	return (
		<TableSelectionProvider>
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
							style={reactFlowStyle}
						>
							<Controls />
							<Background color="#48BFE3" variant={variant} gap={20} />
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
					<ResultTable keys={resultKeys} data={resultData} />
					<Sidebar />
				</ReactFlowProvider>
			</div>
		</TableSelectionProvider>
	);
};

/* NODE TYPES */
const nodeTypes = { select: SelectNode, where: WhereNode, from: FromNode };

export default App;

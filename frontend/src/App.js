import React, { useCallback, useEffect, useRef, useState } from "react";
import Joyride from "react-joyride";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactFlow, {
	Background,
	Controls,
	ReactFlowProvider,
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import ResultTable from "./ResultTable";
import DynamicChatbot from "./chatbot";
import "./index.css";
import FromNode from "./nodes/FromNode";
import "./nodes/FromNode.css";
import SelectNode from "./nodes/SelectNode";
import "./nodes/SelectNode.css";
import WhereNode from "./nodes/WhereNode";
import "./nodes/WhereNode.css";
import Sidebar from "./sidebar";

import NodePanel from "./NodePanel";
import {
	checkAllNodesConnected,
	createAdjacencyList,
	createNewDataNode,
	createNewNode,
	findFroms,
	getIntialNodeValueByType,
	sendQueryToServer,
} from "./appHelperFunctions";
import tourSteps from "./tourSteps";

const reactFlowStyle = {
	background: "#192655",
};

// const ignoreChangeTypes = ["dimensions", "position", "select"];

const App = () => {
	const reactFlowWrapper = useRef(null);
	const [nodes, setNodes] = useState([]);
	const [nodeValues, setNodeValues] = useState([]);
	const [edges, setEdges] = useState([]);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);
	const [resultKeys, setResultKeys] = useState([]);
	const [resultData, setResultData] = useState([]);
	const [resultSQL, setSQL] = useState("");
	const [resultError, setResultError] = useState(false);

	const idRef = useRef(0);

	const onNodesChange = useCallback(
		(changes) => {
			const updatedNodes = applyNodeChanges(changes, nodes);
			for (const { type, id } of changes) {
				if (type === "remove") {
					setNodeValues((prevNodes) =>
						prevNodes.filter((node) => node.id !== id),
					);
					setEdges((prevEdges) =>
						prevEdges.filter(
							(edge) => edge.source !== id && edge.target !== id,
						),
					);
				}
			}
			setNodes(updatedNodes);
		},
		[nodes],
	);

	useEffect(() => {
		// TODO: All nodes are treated as connected, this should be fixed.
		if (nodeValues.length === 0) {
			return;
		}

		// Create the adjacency list
		const adjacencyList = createAdjacencyList(edges);

		// Check if the nodes are connected using dfs
		const allNodesConnected = checkAllNodesConnected(adjacencyList, nodeValues);

		// Iterate over the "Select" and "Where" nodes and find the closest "From" node for each
		const selectWhereNodes = nodeValues.filter(
			(node) => node.type === "select" || node.type === "where",
		);

		if (findFroms(selectWhereNodes, nodeValues, adjacencyList, setNodes)) {
			// Error
			return;
		}

		if (!allNodesConnected) {
			// TODO: Display an error or take appropriate action.
			console.log("All nodes are not connected.");
			return;
		}

		sendQueryToServer(
			nodeValues,
			setResultKeys,
			setResultData,
			setSQL,
			setResultError,
		);
	}, [
		nodeValues,
		edges,
		setNodes,
		setResultKeys,
		setResultData,
		setSQL,
		setResultError,
	]);

	const onEdgesChange = useCallback(
		(changes) => {
			const updatedEdges = applyEdgeChanges(changes, edges);
			setEdges(updatedEdges);
		},
		[edges],
	);

	const onConnect = useCallback(
		(params) =>
			setEdges((prevEdges) =>
				addEdge({ ...params, type: "smoothstep" }, prevEdges),
			),
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
			setNodeValues((prevDataNodes) =>
				prevDataNodes.map((node) =>
					node.id === nodeId ? { ...node, value: newValue } : node,
				),
			);
		},
		[setNodes, setNodeValues],
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

			const initialValue = getIntialNodeValueByType(type);
			const nodeId = `dndnode_${idRef.current++}`;

			const nodeChange = (newValue) => {
				handleSubNodeValueChange(nodeId, newValue);
			};

			const newNode = createNewNode(
				nodeId,
				type,
				position,
				initialValue,
				nodeChange,
			);

			const newDataNode = createNewDataNode(nodeId, type, initialValue);

			setNodes((prevNodes) => [...prevNodes, newNode]);
			setNodeValues((prevNodeData) => [...prevNodeData, newDataNode]);
		},
		[reactFlowInstance, handleSubNodeValueChange],
	);

	const [variant, setVariant] = useState("lines");

	return (
		<div className="dndflow">
			<Joyride
				continuous
				callback={() => {}}
				run={true}
				steps={tourSteps}
				hideCloseButton
				scrollToFirstStep
				showSkipButton
				showProgress
			/>
			<ToastContainer limit={1} />
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
						connectionLineType="smoothstep"
						onInit={setReactFlowInstance}
						onDrop={onDrop}
						onDragOver={onDragOver}
						fitView
						style={reactFlowStyle}
					>
						<Controls position="bottom-center" />
						<Background color="#48BFE3" variant={variant} gap={20} />
						<NodePanel setVariant={setVariant} />
					</ReactFlow>
				</div>
				<ResultTable
					keys={resultKeys}
					data={resultData}
					sql={resultSQL}
					hadError={resultError}
				/>
				<Sidebar />
			</ReactFlowProvider>
		</div>
	);
};

/* NODE TYPES */
const nodeTypes = { select: SelectNode, where: WhereNode, from: FromNode };

export default App;

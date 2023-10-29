import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Joyride, { STATUS } from "react-joyride";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactFlow, {
	Background,
	Controls,
	Panel,
	ReactFlowProvider,
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import styled from "styled-components";
import ResultTable from "./ResultTable";
import DynamicChatbot from "./chatbot";
import "./index.css";
import FromNode from "./nodes/FromNode";
import "./nodes/FromNode.css";
import SelectNode from "./nodes/SelectNode";
import "./nodes/SelectNode.css";
import { TableSelectionProvider } from "./nodes/TableSelectionContext";
import WhereNode from "./nodes/WhereNode";
import "./nodes/WhereNode.css";
import Sidebar from "./sidebar";

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
					errorData.detail.forEach((err) => {
						if (err.msg.includes("FROM cannot be an empty string")) {
							toast.info("Please select a table in 🟦FROM.", {
								position: "bottom-center",
								autoClose: 3000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: true,
								progress: undefined,
								theme: "light",
							});
						}
						if (err.msg.includes("SELECT list cannot be empty")) {
							toast.info("Please select a column in SELECT.", {
								position: "bottom-center",
								autoClose: 3000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: true,
								progress: undefined,
								theme: "light",
							});
						} else {
							toast.info(err.msg, {
								position: "bottom-center",
								autoClose: 3000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: true,
								progress: undefined,
								theme: "colored",
							});
						}
					});
				} else {
					console.log(errorData.detail);
					if (errorData.detail.includes("No FROM node found")) {
						toast.info("Use 🟦FROM to select a table.", {
							position: "bottom-center",
							autoClose: 3000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							theme: "colored",
						});
					} else {
						toast.info(errorData.detail, {
							position: "bottom-center",
							autoClose: 3000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							theme: "light",
						});
					}
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
					initialValue = "";
					break;
				case "where":
					initialValue = {
						column: "",
						column_type: "",
						compared_value: "",
						comparator: "",
					};
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

	const [{ run, steps }, setSteps] = useState({
		run: true,
		steps: [
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
				content: <h2>First ting first, use a FROM to select the table.</h2>,
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
				content: <h2>Your data table is in the output window!</h2>,
				placement: "left",
				target: "#outputWindow",
				title: "Output",
			},
			{
				content: <h2>Use this button to open/close the toolbox.</h2>,
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
		],
	});

	return (
		<TableSelectionProvider>
			<div className="dndflow">
				<Joyride
					continuous
					callback={() => {}}
					run={run}
					steps={steps}
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
							onInit={setReactFlowInstance}
							onDrop={onDrop}
							onDragOver={onDragOver}
							fitView
							style={reactFlowStyle}
						>
							<Controls position="bottom-right" />
							<Background color="#48BFE3" variant={variant} gap={20} />
							<Panel>
								<button
									className="panel-button"
									type="button"
									onClick={() => setVariant("dots")}
								>
									·
								</button>
								<button
									className="panel-button"
									type="button"
									onClick={() => setVariant("lines")}
								>
									—
								</button>
								<button
									className="panel-button"
									type="button"
									onClick={() => setVariant("cross")}
								>
									+
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

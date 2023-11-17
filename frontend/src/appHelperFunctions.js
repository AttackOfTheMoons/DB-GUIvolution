import axios from "axios";
import { toast } from "react-toastify";

export const createAdjacencyList = (edges) => {
	const adjacencyList = {};

	edges.forEach(({ source, target }) => {
		adjacencyList[source] = adjacencyList[source] || [];
		adjacencyList[target] = adjacencyList[target] || [];
		adjacencyList[source].push(target);
		adjacencyList[target].push(source);
	});
	return adjacencyList;
};
export const checkAllNodesConnected = (adjacencyList, nodeValues) => {
	function depthFirstSearch(node, visited) {
		visited[node] = true;
		adjacencyList[node]?.forEach((neighbor) => {
			if (!visited[neighbor]) {
				depthFirstSearch(neighbor, visited);
			}
		});
	}

	// Start the DFS from the first node in nodeData
	const visitedNodes = {};
	depthFirstSearch(nodeValues[0].id, visitedNodes);

	// Check if all nodes are connected
	return nodeValues.every((node) => visitedNodes[node.id]);
};

export const findClosestFromNodeBFS = (
	callingNode,
	nodeData,
	adjacencyList,
) => {
	const queue = [{ node: callingNode, distance: 0 }];
	const visited = new Set();

	while (queue.length > 0) {
		const { node, distance } = queue.shift();
		visited.add(node.id);

		if (node.type === "from") {
			if (distance > 0) {
				return node; // Found the closest "From" node
			}
		}
		if (!adjacencyList[node.id]) {
			return null;
		}

		// Enqueue neighboring nodes
		for (const neighborId of adjacencyList[node.id]) {
			if (!visited.has(neighborId)) {
				const neighborNode = nodeData.find((n) => n.id === neighborId);
				neighborNode &&
					queue.push({ node: neighborNode, distance: distance + 1 });
			}
		}
	}

	return null; // No "From" node found within the graph
};

export const findFroms = (
	selectWhereNodes,
	nodeValues,
	adjacencyList,
	setNodes,
) => {
	let fromNotFound = false;
	selectWhereNodes.forEach((nodeNeedsFromTable) => {
		const closestFromNode = findClosestFromNodeBFS(
			nodeNeedsFromTable,
			nodeValues,
			adjacencyList,
		);
		const selectedTable = closestFromNode ? closestFromNode.value : "";
		setNodes((prevNodes) =>
			prevNodes.map((node) =>
				node.id === nodeNeedsFromTable.id
					? { ...node, data: { ...node.data, selectedTable } }
					: node,
			),
		);
		console.log(
			"table assignment",
			nodeNeedsFromTable.id,
			closestFromNode ? closestFromNode.value : "",
		);
		if (!closestFromNode) {
			fromNotFound = true;
		}
	});
	return fromNotFound;
};

const showNotification = (message, theme) => {
	toast.info(message, {
		position: "bottom-center",
		autoClose: 3000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: theme,
	});
};

export const sendQueryToServer = (
	nodeValues,
	setResultKeys,
	setResultData,
	setSQL,
	setError,
	flavor,
) => {
	axios
		.post("/queries/", { nodes: nodeValues, flavor: flavor })
		.then((response) => {
			const data = response.data;
			if (!data) {
				console.error("Unexpected response from server?");
			}
			setResultKeys(data.keys);
			setResultData(data.data);
			setSQL(data.sql.sql_query);
			setError(false);
		})
		.catch((error) => {
			const errorData = error.response.data;
			setError(true);
			// These errors shouldn't happen tm
			if (!errorData || !errorData.detail) {
				console.error("Unhandled server error.");
				return;
			}
			// TODO: These errors we should display to the user.
			if (Array.isArray(errorData.detail)) {
				errorData.detail.forEach((err) => {
					if (err.msg.includes("FROM cannot be an empty string")) {
						showNotification("Please select a table in 🟦FROM.", "light");
					}
					if (err.msg.includes("SELECT list cannot be empty")) {
						showNotification("Please select a column in SELECT.", "light");
					} else {
						// showNotification(err.msg, "colored");
						console.error(err.msg);
					}
				});
			} else {
				console.log(errorData.detail);
				if (errorData.detail.includes("No FROM node found")) {
					showNotification("Use 🟦FROM to select a table.", "colored");
				} else {
					console.error(errorData.detail);
					// showNotification(errorData.detail, "light");
				}
			}
		});
};

export const getIntialNodeValueByType = (type) => {
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
			return "";
	}
	return initialValue;
};

export const createNewNode = (
	nodeId,
	type,
	position,
	initialValue,
	nodeChange,
) => ({
	id: nodeId,
	type,
	position,
	data: {
		label: `${type}`,
		nodeValue: initialValue,
		handleNodeValueChange: nodeChange,
	},
});

export const createNewDataNode = (nodeId, type, initialValue) => ({
	id: nodeId,
	type,
	value: initialValue,
});

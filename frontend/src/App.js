import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./App.css";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
} from "react-flow-renderer";

import Sidebar from "./sidebar.js";
let id = 0;
const getId = () => `dndnode_${id++}`;

// // Set the base URL for Axios requests
// axios.defaults.baseURL = "http://localhost:8000"; // Update with your FastAPI server URL

function App() {
  //   const [message, setMessage] = useState("");
  //   useEffect(() => {
  //     // Make an HTTP GET request to /hello
  //     axios
  //       .get("/")
  //       .then((response) => {
  //         // Set the response data (e.g., "Hello, World!") in the state
  //         setMessage(response.data.message);
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //       });
  //   }, []);

  const initialNodes = [
    { id: "1", data: { label: "Node 1" }, position: { x: 250, y: 0 } },
    { id: "2", data: { label: "Node 2" }, position: { x: 150, y: 100 } },
  ];

  const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  //const [elements, setElements] = useState(InitialElements);
  //const onConnect = (params) => setElements((els) => addEdge(params, els));
  const onConnect = useCallback((connection) =>
    setEdges((eds) => addEdge(connection, eds))
  );
  const onNodesChange = useCallback(
    (changes) => setNodes((ns) => applyNodeChanges(changes, ns)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((es) => applyEdgeChanges(changes, es)),
    []
  );
  const onLoad = (_reactFlowInstance) =>
    setReactFlowInstance(_reactFlowInstance);
  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };
  const onDrop = (event) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData("application/reactflow");
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode = {
      id: getId(),
      type,
      position,
      data: { label: `${type} node` },
    };
    //setElements((es) => es.concat(newNode));
    setEdges((eds) => addEdge(newNode, eds));
  };
  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div
          className="reactflow-wrapper"
          style={{ height: "500px", width: "500px" }}
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onLoad={onLoad}
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
    </div>
  );
}

export default App;

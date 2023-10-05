import React, { useState, useRef, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import SelectNode from "./nodes/SelectNode";
import WhereNode from "./nodes/WhereNode";
import FromNode from "./nodes/FromNode";
import "./nodes/SelectNode.css";
import "./nodes/WhereNode.css";
import "./nodes/FromNode.css";
import Sidebar from "./Sidebar";

import "./index.css";

const initialNodes = [
  {
    id: "1",
    type: "default",
    data: { label: "I'm a node. You can delete me." },
    position: { x: 250, y: 5 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
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
    [reactFlowInstance]
  );

  const [variant, setVariant] = useState("lines");

  return (
    <div className="dndflow">
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
            <MiniMap />
            <Background color="#62D2A2" variant={variant} gap={16} />
            <Panel>
              <div>Background:</div>
              <button onClick={() => setVariant("dots")}>dots</button>
              <button onClick={() => setVariant("lines")}>lines</button>
              <button onClick={() => setVariant("cross")}>cross</button>
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

export default DnDFlow;

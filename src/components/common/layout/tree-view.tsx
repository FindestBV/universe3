import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";

export const TreeView = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeLabel, setNodeLabel] = useState("");

  useEffect(() => {
    const worker = new Worker(new URL("./treeWorker.js", import.meta.url));
    worker.postMessage("init");

    worker.onmessage = (event) => {
      const { computedNodes, computedEdges } = event.data;
      setNodes(computedNodes);
      setEdges(computedEdges);
    };

    return () => worker.terminate();
  }, []);

  const restoreDefaultConnections = () => {
    const worker = new Worker(new URL("./treeWorker.js", import.meta.url));
    worker.postMessage("init");

    worker.onmessage = (event) => {
      const { computedEdges } = event.data;
      setEdges(computedEdges);
    };
  };

  const onNodesChange = (changes) => setNodes((nds) => applyNodeChanges(changes, nds));
  const onEdgesChange = (changes) => setEdges((eds) => applyEdgeChanges(changes, eds));
  const onConnect = (connection) => setEdges((eds) => addEdge(connection, eds));

  const onNodeClick = useCallback((event, node) => {
    console.log("Clicked Node:", node.data.label);
    setSelectedNode(node);
    setNodeLabel(node.data.label);
  }, []);

  const updateNodeLabel = () => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === selectedNode.id ? { ...node, data: { ...node.data, label: nodeLabel } } : node,
      ),
    );
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <button
        onClick={restoreDefaultConnections}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        Restore Connections
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      {selectedNode && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "8px 16px",
            borderRadius: "4px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <strong>Edit Node</strong>
          <input
            type="text"
            value={nodeLabel}
            onChange={(e) => setNodeLabel(e.target.value)}
            placeholder="Enter node name"
            style={{ display: "block", marginTop: "8px", padding: "4px" }}
          />
          <button
            onClick={updateNodeLabel}
            style={{ marginTop: "8px", padding: "4px 8px", cursor: "pointer" }}
          >
            Update Name
          </button>
        </div>
      )}
    </div>
  );
};

export default TreeView;

import React, { useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";

const demoData = [
  { id: "1", name: "Root", type: "root", lowerLevelNodes: ["2", "3"] },
  { id: "2", name: "Child 1", type: "branch", lowerLevelNodes: ["4"] },
  { id: "3", name: "Child 2", type: "branch", lowerLevelNodes: [] },
  { id: "4", name: "Leaf 1", type: "leaf", lowerLevelNodes: [] },
];

export const TreeView = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (!demoData || demoData.length === 0) return;

    const rawNodes = demoData.map((item, index) => ({
      id: item.id,
      data: { label: item.name, type: item.type },
      position: { x: index * 150, y: 100 },
      type: "default",
    }));

    const rawEdges = demoData.flatMap((item) =>
      item.lowerLevelNodes.map((childId) => ({
        id: `${item.id}-${childId}`,
        source: item.id,
        target: childId,
        animated: true,
        type: "smoothstep",
      })),
    );

    setNodes(rawNodes);
    setEdges(rawEdges);
  }, []);

  const onNodesChange = (changes) => setNodes((nds) => applyNodeChanges(changes, nds));
  const onEdgesChange = (changes) => setEdges((eds) => applyEdgeChanges(changes, eds));
  const onConnect = (connection) => setEdges((eds) => addEdge(connection, eds));

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default TreeView;

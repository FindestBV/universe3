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

const demoData = [
  { id: "1", name: "Root Document", type: "root", lowerLevelNodes: ["2", "3"] },
  { id: "2", name: "Chapter 1", type: "chapter", lowerLevelNodes: ["4", "5"] },
  { id: "3", name: "Chapter 2", type: "chapter", lowerLevelNodes: ["6"] },
  { id: "4", name: "Section 1.1", type: "section", lowerLevelNodes: ["7", "8"] },
  { id: "5", name: "Section 1.2", type: "section", lowerLevelNodes: [] },
  { id: "6", name: "Section 2.1", type: "section", lowerLevelNodes: ["9"] },
  { id: "7", name: "Subsection 1.1.1", type: "subsection", lowerLevelNodes: [] },
  { id: "8", name: "Subsection 1.1.2", type: "subsection", lowerLevelNodes: [] },
  { id: "9", name: "Subsection 2.1.1", type: "subsection", lowerLevelNodes: [] },
];

export const TreeViewStatic = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    const rawNodes = demoData.map((item, index) => ({
      id: item.id,
      data: { label: item.name, type: item.type },
      position: { x: (index % 3) * 200, y: Math.floor(index / 3) * 150 },
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
  const onConnect = (connection) =>
    setEdges((eds) => addEdge({ ...connection, animated: true }, eds));

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
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

export default TreeViewStatic;

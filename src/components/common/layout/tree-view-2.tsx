import * as d3 from "d3";

import React, { useEffect, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

const demoData = [
  { id: "1", name: "Root", type: "root", lowerLevelNodes: ["2", "3"] },
  { id: "2", name: "Child 1", type: "branch", lowerLevelNodes: ["4"] },
  { id: "3", name: "Child 2", type: "branch", lowerLevelNodes: [] },
  { id: "4", name: "Leaf 1", type: "leaf", lowerLevelNodes: [] },
];

export const TreeView2 = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (!demoData || demoData.length === 0) return;

    const rawNodes = demoData.map((item) => ({
      id: item.id,
      data: { label: item.name, type: item.type },
      position: { x: 0, y: 0 },
    }));

    const rawEdges = [];
    demoData.forEach((item) => {
      item.lowerLevelNodes.forEach((childId) => {
        rawEdges.push({ source: item.id, target: childId });
      });
    });

    const simulation = d3
      .forceSimulation(rawNodes)
      .force(
        "link",
        d3
          .forceLink(rawEdges)
          .id((d) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
      .on("tick", () => {
        setNodes(
          rawNodes.map((node) => ({
            ...node,
            position: { x: node.x, y: node.y },
          })),
        );
        setEdges(
          rawEdges.map((link) => ({
            id: `${link.source}-${link.target}`,
            source: link.source,
            target: link.target,
          })),
        );
      });

    return () => simulation.stop();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default TreeView2;

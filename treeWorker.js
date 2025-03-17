import * as d3 from "d3";

self.onmessage = (e) => {
  const treeData = e.data;
  if (!treeData || treeData.length === 0) return;

  const rawNodes = treeData.map((item) => ({
    id: item.id,
    data: { label: item.name, type: item.type },
    position: { x: 0, y: 0 },
  }));

  const rawEdges = [];
  treeData.forEach((item) => {
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
    .force("center", d3.forceCenter(500, 300))
    .on("tick", () => {
      self.postMessage({
        computedNodes: rawNodes.map((node) => ({
          ...node,
          position: { x: node.x, y: node.y },
        })),
        computedEdges: rawEdges.map((link) => ({
          id: `${link.source}-${link.target}`,
          source: link.source,
          target: link.target,
        })),
      });
    });

  setTimeout(() => simulation.stop(), 3000); // Stop after 3 seconds
};

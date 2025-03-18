importScripts("https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js");

self.onmessage = (event) => {
  if (event.data !== "init") return;

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

  const nodes = demoData.map((item) => ({
    id: item.id,
    data: { label: item.name, type: item.type },
    position: { x: 0, y: 0 },
  }));

  const edges = demoData.flatMap((item) =>
    item.lowerLevelNodes.map((childId) => ({
      id: `${item.id}-${childId}`,
      source: item.id,
      target: childId,
      animated: true,
      type: "smoothstep",
    })),
  );

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(edges)
        .id((d) => d.id)
        .distance(100),
    )
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(500, 300))
    .on("tick", () => {
      self.postMessage({
        computedNodes: nodes.map((node) => ({
          ...node,
          position: { x: node.x, y: node.y },
        })),
        computedEdges: edges,
      });
    });

  setTimeout(() => simulation.stop(), 3000);
};

importScripts("https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js");

const simulations = {};

// Handle messages from the main thread
self.onmessage = (event) => {
  const { type, data } = event.data;
  const { graphId } = data;

  switch (type) {
    case "updateGraph": {
      const { nodes, links } = data;
      const width = 800,
        height = 800;
      const distance = 100;
      const strength = -1000;
      const radius = 30;
      // Initialize node positions if not defined
      nodes.forEach((node) => {
        node.x = node.x ?? Math.random() * width - width / 2;
        node.y = node.y ?? Math.random() * height - height / 2;
      });

      // Resolve source/target to actual node objects
      links.forEach((link) => {
        link.source = nodes.find((n) => n.id === link.source);
        link.target = nodes.find((n) => n.id === link.target);
      });

      const tickHandler = () => {
        const MAX_TICKS = 100;
        simulations[graphId].tickCount++;
        if (simulations[graphId].tickCount >= MAX_TICKS) {
          //  simulations[graphId].simulation.stop();
        }

        self.postMessage({ type: "graphData", data: { graphId, nodes, links } });
      };

      const forceNode = d3.forceManyBody().strength(strength);
      const forceLink = d3
        .forceLink(links)
        .distance(distance)
        .id((node) => node.id);

      if (!simulations[graphId]) {
        simulations[graphId] = {
          nodes,
          links,
          simulation: d3
            .forceSimulation(nodes)
            .force("link", forceLink)
            .force("charge", forceNode)
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .force("collision", d3.forceCollide().radius(radius))
            .on("tick", tickHandler),
          tickCount: 0,
        };
      }
      break;
    }
    case "removeGraph":
      if (simulations[graphId]) {
        simulations[graphId].simulation.stop();
        delete simulations[graphId];
      }
      break;
    case "nodeDragStarted": {
      const { nodeId, x, y, shouldStart } = data;

      if (shouldStart) {
        const sim = simulations[graphId];
        sim.simulation.alphaTarget(0.3).restart();
      }

      const node = simulations[graphId].nodes.find((n) => n.id === nodeId);
      if (node) {
        node.fx = x;
        node.fy = y;
      }
      break;
    }
    case "nodeDragged": {
      const { nodeId, x, y } = data;
      const node = simulations[graphId].nodes.find((n) => n.id === nodeId);
      if (node) {
        node.fx = x;
        node.fy = y;
      }
      break;
    }
    case "nodeDragEnded": {
      const { nodeId, shouldStart } = data;
      if (shouldStart) {
        const sim = simulations[graphId];
        sim.simulation.alphaTarget(0);
      }
      const node = simulations[graphId].nodes.find((n) => n.id === nodeId);
      if (node) {
        node.fx = null;
        node.fy = null;
      }
      break;
    }
    default:
      break;
  }
};

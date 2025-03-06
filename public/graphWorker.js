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
      const distance = 160;
      const strength = -40;
      const radius = 45;
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
          simulations[graphId].simulation.stop();
        }
        self.postMessage({ type: "graphData", data: { graphId, nodes, links } });
      };

      // Create or update simulation
      if (!simulations[graphId]) {
        simulations[graphId] = {
          nodes,
          links,
          simulation: d3
            .forceSimulation(nodes)
            .force(
              "link",
              d3
                .forceLink(links)
                .id((d) => d.id)
                .distance(distance),
            )
            .force("charge", d3.forceManyBody().strength(strength))
            .force("center", d3.forceCenter(0, 0))
            .force("collision", d3.forceCollide(radius))
            .on("tick", tickHandler),
          tickCount: 0,
        };
      } else {
        // Update the simulation with the new data
        const sim = simulations[graphId];
        sim.simulation.nodes(nodes);
        sim.simulation.force("link").links(links);
        sim.simulation.alpha(1).restart();
        sim.tickCount = 0;
      }
      break;
    }
    case "removeGraph":
      if (simulations[graphId]) {
        simulations[graphId].simulation.stop();
        delete simulations[graphId];
      }
      break;
    default:
      break;
  }
};

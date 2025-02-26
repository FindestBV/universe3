/* forceGraphWorker.js */
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation } from "d3-force";

self.onmessage = (event) => {
  // console.log("Worker received data:", event.data);
  const { nodes, links } = event.data;

  const simulation = forceSimulation(nodes)
    .force(
      "link",
      forceLink(links)
        .id((d) => d.id)
        .distance(100),
    )
    .force("charge", d3.forceManyBody().strength(-30)) // Lower from -50 to -30
    .force("center", forceCenter(0, 0))
    .force("collision", forceCollide(20))
    .on("tick", () => {
      self.postMessage({ nodes, links });
    });

  self.onmessage = (event) => {
    if (event.data === "STOP") {
      simulation.stop();
    }
  };
};

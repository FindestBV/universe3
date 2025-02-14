import { select, zoom, zoomIdentity } from "d3";

import { FC, useEffect, useRef, useState } from "react";

const NODE_RADIUS = 10;

export const ForceDirectedGraphView: FC<{ linkingData: any[] }> = ({ linkingData }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    if (!linkingData || linkingData.length === 0) return;

    // 1️⃣ Create a Web Worker dynamically
    const workerCode = `
    self.onmessage = (event) => {
      const { nodes, links } = event.data;
      importScripts("https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js");
  
      const width = 1000; // Define a reasonable space for nodes
      const height = 800;
  
      // 1️⃣ Set initial positions to prevent clustering
      nodes.forEach((node, i) => {
        node.x = Math.random() * width - width / 2;
        node.y = Math.random() * height - height / 2;
      });
  
      let tickCount = 0;
      const MAX_TICKS = 150; 
  
      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(150)) // Increase distance
        .force("charge", d3.forceManyBody().strength(-30)) // Reduce repelling force
        .force("center", d3.forceCenter(0, 0))
        .force("collision", d3.forceCollide(30))
        .on("tick", () => {
          if (tickCount >= MAX_TICKS) {
            simulation.stop();
            console.log("Simulation stopped after stabilization");
            return;
          }
          tickCount++;
          self.postMessage({ nodes, links });
        });
  
      self.onmessage = (event) => {
        if (event.data === "STOP") {
          simulation.stop();
        }
      };
    };
  `;

    const blob = new Blob([workerCode], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));

    worker.postMessage({
      nodes: linkingData,
      links: linkingData.flatMap((node) =>
        (node.lowerLevelNodes || []).map((child) => ({ source: node.id, target: child.id })),
      ),
    });

    worker.onmessage = (event) => {
      setGraphData(event.data);
    };

    return () => {
      worker.postMessage("STOP");
      worker.terminate();
    };
  }, [linkingData]);

  const draw = (canvas, ctx, transform, graphData) => {
    if (!canvas || !ctx) return; // Ensure canvas and context exist

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);

    // Draw Links
    ctx.strokeStyle = "#999";
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    graphData.links.forEach((link) => {
      const source = graphData.nodes.find((n) => n.id === link.source);
      const target = graphData.nodes.find((n) => n.id === link.target);
      if (source && target) {
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
      }
    });
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Draw Nodes
    graphData.nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "#0099CC";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let transform = { k: 1, x: 0, y: 0 };

    const zoomBehavior = zoom()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        transform = event.transform;
        draw(canvas, ctx, transform, graphData); // ✅ Pass canvas reference
      });

    select(canvas).call(zoomBehavior);

    // Set initial zoom scale and center
    const initialScale = 0.1;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    transform = zoomIdentity.translate(centerX, centerY).scale(initialScale);

    select(canvas).call(zoomBehavior.transform, transform); // Apply zoom transform

    draw(canvas, ctx, transform, graphData); // ✅ Pass canvas reference
  }, [graphData]);

  return <canvas ref={canvasRef} width={800} height={600} />;
};

export default ForceDirectedGraphView;

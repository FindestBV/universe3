import { select, zoom, zoomIdentity } from "d3";

import { FC, useEffect, useRef, useState } from "react";

const NODE_RADIUS = 40; // Node size

export const ForceDirectedGraphView: FC<{ linkingData: any[] }> = ({ linkingData }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [hoveredNode, setHoveredNode] = useState(null); // Stores hovered node for tooltips

  useEffect(() => {
    if (!linkingData || linkingData.length === 0) return;

    const workerCode = `
      self.onmessage = (event) => {
        const { nodes, links } = event.data;
        importScripts("https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js");

        const width = 800, height = 800;

        nodes.forEach((node) => {
          node.x = node.x ?? (Math.random() * width - width / 2);
          node.y = node.y ?? (Math.random() * height - height / 2);
        });

        links.forEach(link => {
          link.source = nodes.find(n => n.id === link.source);
          link.target = nodes.find(n => n.id === link.target);
        });

        let tickCount = 0, MAX_TICKS = 100;

        const simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d => d.id).distance(160))
          .force("charge", d3.forceManyBody().strength(-40)) 
          .force("center", d3.forceCenter(0, 0))
          .force("collision", d3.forceCollide(45))
          .on("tick", () => {
            if (tickCount++ >= MAX_TICKS) simulation.stop();
            self.postMessage({ nodes, links });
          });

        self.onmessage = (event) => {
          if (event.data === "STOP") simulation.stop();
        };
      };
    `;

    // 🔧 Create Web Worker
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
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);

    // ✅ Ensure Link Lines Are Visible (BLACK)
    ctx.strokeStyle = "#000"; // Ensure black links
    ctx.lineWidth = 4;
    ctx.globalAlpha = 1;
    ctx.beginPath();

    graphData.links.forEach((link) => {
      const { source, target } = link; // ✅ Now source & target are objects
      if (!source || !target) return;

      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
    });

    ctx.stroke(); // ✅ Ensures links are drawn

    // ✅ Draw Nodes
    graphData.nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = node === hoveredNode ? "#FF5733" : "#000000";
      ctx.fill();
      ctx.strokeStyle = "#FFF";
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    ctx.restore();
  };

  // 🖱️ Hover to Show Tooltips
  const setupHoverEvents = (canvas, transform, graphData) => {
    canvas.addEventListener("mousemove", (event) => {
      const mouseX = (event.offsetX - transform.x) / transform.k;
      const mouseY = (event.offsetY - transform.y) / transform.k;

      const hovered = graphData.nodes.find(
        (node) => Math.hypot(node.x - mouseX, node.y - mouseY) < NODE_RADIUS,
      );

      setHoveredNode(hovered); // Store hovered node to show tooltip
    });

    canvas.addEventListener("mouseleave", () => {
      setHoveredNode(null); // Hide tooltip when leaving canvas
    });
  };

  // 🏗️ Enable Dragging of Nodes with Smooth Animation
  const setupDrag = (canvas, ctx, transform, graphData) => {
    let draggingNode = null;

    canvas.addEventListener("mousedown", (event) => {
      const mouseX = (event.offsetX - transform.x) / transform.k;
      const mouseY = (event.offsetY - transform.y) / transform.k;
      draggingNode = graphData.nodes.find(
        (node) => Math.hypot(node.x - mouseX, node.y - mouseY) < NODE_RADIUS,
      );
    });

    canvas.addEventListener("mousemove", (event) => {
      if (draggingNode) {
        const mouseX = (event.offsetX - transform.x) / transform.k;
        const mouseY = (event.offsetY - transform.y) / transform.k;

        draggingNode.x += (mouseX - draggingNode.x) * 0.2; // ✅ Smooth dragging
        draggingNode.y += (mouseY - draggingNode.y) * 0.2;

        draw(canvas, ctx, transform, graphData);
      }
    });

    canvas.addEventListener("mouseup", () => {
      draggingNode = null;
    });
  };

  // 🏗️ Initialize Graph Rendering & Events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let transform = { k: 1, x: 0, y: 0 };

    // 🔍 Zoom and Pan Behavior
    const zoomBehavior = zoom()
      .scaleExtent([0.1, 2])
      .on("zoom", (event) => {
        transform = event.transform;
        draw(canvas, ctx, transform, graphData);
      });

    select(canvas).call(zoomBehavior);

    // Set Initial Zoom & Centering (Scale 0.11)
    const initialScale = 0.1;
    const initialX = canvas.width / 2;
    const initialY = canvas.height / 2;
    transform = zoomIdentity.translate(initialX, initialY).scale(initialScale);
    select(canvas).call(zoomBehavior.transform, transform);

    // Enable Features
    setupHoverEvents(canvas, transform, graphData);
    setupDrag(canvas, ctx, transform, graphData);
    draw(canvas, ctx, transform, graphData);
  }, [graphData]);

  return (
    <div>
      {hoveredNode && (
        <div
          style={{
            position: "absolute",
            left: "20px",
            top: "10px",
            background: "white",
            padding: "10px",
            borderRadius: "4px",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)",
          }}
        >
          {hoveredNode.name} {hoveredNode.id}
        </div>
      )}
      <canvas ref={canvasRef} width={800} height={800} />
    </div>
  );
};

export default ForceDirectedGraphView;

import { select, zoom, zoomIdentity } from "d3";

import { FC, useEffect, useRef, useState } from "react";

const NODE_RADIUS = 30;

export const OverviewForceDirected: FC<{ linkingData: any[] }> = ({ linkingData }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    if (!linkingData || linkingData.length === 0) return;

    const nodes = linkingData.map((node) => ({
      id: node.id,
      x: Math.random() * 600,
      y: Math.random() * 600,
    }));

    const links = linkingData.flatMap((node) =>
      (node.lowerLevelNodes || []).map((childId) => ({ source: node.id, target: childId })),
    );

    setGraphData({ nodes, links });
  }, [linkingData]);

  const draw = (canvas, ctx, transform, graphData) => {
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();

    graphData.links.forEach(({ source, target }) => {
      const sourceNode = graphData.nodes.find((n) => n.id === source);
      const targetNode = graphData.nodes.find((n) => n.id === target);
      if (!sourceNode || !targetNode) return;
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
    });

    ctx.stroke();

    graphData.nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.strokeStyle = "#FFF";
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
      .scaleExtent([0.5, 1])
      .on("zoom", (event) => {
        transform = event.transform;
        draw(canvas, ctx, transform, graphData);
      });

    select(canvas).call(zoomBehavior);
    draw(canvas, ctx, transform, graphData);
  }, [graphData]);

  return <canvas ref={canvasRef} width={800} height={600} />;
};

export default OverviewForceDirected;

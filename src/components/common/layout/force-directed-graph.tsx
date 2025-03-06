/**
 * ForceDirectedGraphView Component (WIP)
 *
 * This component renders a **Force-Directed Graph** using an HTML Canvas and a Web Worker.
 * It **offloads graph simulation computations to a Web Worker**, significantly improving UI performance
 * by keeping the main thread free for responsive interactions.
 *
 *
 * ## Features:
 * - **Force Simulation**: Uses `d3-force` to dynamically arrange nodes.
 * - **Web Worker Offloading**: Moves physics calculations off the main thread for smooth rendering.
 * - **Canvas Rendering**: Optimized for large datasets and high-performance drawing.
 * - **Interactivity**:
 *   - **Zoom & Pan**: Uses `d3-zoom` to navigate the graph.
 *   - **Hover & Tooltips**: Displays information when hovering over nodes.
 *   - **Node Dragging**: Allows repositioning of nodes dynamically.
 *
 *
 * ## Performance Optimizations:
 * - **Web Worker (Multi-Threading)**: Prevents UI lag by running the force simulation in a background thread.
 * - **Canvas Rendering**: More efficient than SVG for large graphs.
 * - **Batch Rendering**: Uses a single draw call instead of updating DOM elements.
 * - **Alpha Decay & Velocity Decay**: Controls the damping effect for better stabilization.
 *
 * ## Customization & Settings:
 * - **Graph Layout**: Modify force properties (`charge`, `linkDistance`, `gravity`) in the worker code.
 * - **Zoom Controls**: Adjust default zoom levels via `zoomExtent` or `initialZoom`.
 * - **Node Styling**: Customize `nodeRadius`, `nodeColor`, and tooltips.
 * - **Edge Styling**: Modify `strokeWidth`, `edgeColor`, or implement curved edges.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object[]} props.linkingData - Array of node objects `{ id, label, group }` with their connections.
 *
 * @example
 * <ForceDirectedGraphView linkingData={[{ id: "1", label: "Node A", group: 1 }]} />
 *
 * @dependencies
 * - **D3.js**: Used for force simulation, zooming, and event handling.
 * - **Web Workers**: Runs force simulation calculations asynchronously.
 * - **React Hooks**: Manages state updates for rendering.
 *
 * @returns {JSX.Element} The rendered ForceDirectedGraphView component.
 */
import { ObjectTypeEnum } from "@/types/types";
import GlobalGraphWorker from "@/workers/GlobalGraphWorker";
import { drag as d3Drag, select, Simulation, zoom, zoomIdentity } from "d3";

import { FC, useEffect, useRef, useState } from "react";

const NODE_RADIUS = 30; // Node size

export const ForceDirectedGraphView: FC<{ linkingData: any[]; id: string }> = ({
  linkingData,
  id,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [hoveredNode, setHoveredNode] = useState(null); // Stores hovered node for tooltips
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Stores mouse coordinates

  const forceGraphContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!linkingData || linkingData.length === 0) return;

    const graphWorker = GlobalGraphWorker.getWorker();

    const handleMessage = ({ nodes, links }) => {
      setGraphData({ nodes, links });
    };

    GlobalGraphWorker.registerCallback(id, handleMessage);

    graphWorker.postMessage({
      type: "updateGraph",
      data: {
        graphId: id,
        nodes: linkingData,
        links: linkingData.flatMap((node) =>
          (node.lowerLevelNodes || []).map((child) => ({
            source: node.id,
            target: child.id,
          })),
        ),
      },
    });

    return () => {
      GlobalGraphWorker.deregisterCallback(id);
      graphWorker.postMessage({ type: "removeGraph", data: { graphId: id } });
    };
  }, [linkingData, id]);

  const getObjectTypeColor = (objectType: ObjectTypeEnum): string => {
    switch (objectType) {
      case ObjectTypeEnum.Entity:
        return "#00ADEF";
      case ObjectTypeEnum.Study:
        return "#5856D6";
      case ObjectTypeEnum.Query:
        return "#A30076";
      default:
        return "#00ADEF";
    }
  };

  const draw = (canvas, ctx, transform, graphData) => {
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);

    // Ensure Link Lines Are Visible (BLACK)
    ctx.strokeStyle = "#000"; // Ensure black links
    ctx.lineWidth = 4;
    ctx.globalAlpha = 1;
    ctx.beginPath();

    graphData.links.forEach((link) => {
      const { source, target } = link; // Now source & target are objects
      if (!source || !target) return;

      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
    });

    ctx.stroke(); // Ensures links are drawn

    // Draw Nodes
    graphData.nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = node === hoveredNode ? getObjectTypeColor(node.objectType) : "#000000";
      ctx.fill();
      ctx.strokeStyle = "#FFF";
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    ctx.restore();
  };

  // Hover to Show Tooltips (temp - this will likley need significant update )
  const setupHoverEvents = (canvas, transform, graphData) => {
    canvas.addEventListener("mousemove", (event) => {
      const mouseX = (event.offsetX - transform.x) / transform.k;
      const mouseY = (event.offsetY - transform.y) / transform.k;

      const hovered = graphData.nodes.find(
        (node) => Math.hypot(node.x - mouseX, node.y - mouseY) < NODE_RADIUS,
      );
      if (!hovered) return;

      setHoveredNode(hovered); // Store hovered node to show tooltip

      const screenX = hovered.x * transform.k + transform.x;
      const screenY = hovered.y * transform.k + transform.y;

      setMousePosition({ x: screenX, y: screenY });
    });

    canvas.addEventListener("mouseleave", () => {
      setHoveredNode(null); // Hide tooltip when leaving canvas
    });
  };

  // Enable Dragging of Nodes with Smooth Animation
  const drag = (currSimulation: Simulation<INode, ILink>) => {
    function dragstarted(event: D3DragEvent<Element, INode, INode>) {
      if (!event.active) currSimulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: D3DragEvent<Element, INode, INode>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: D3DragEvent<Element, INode, INode>) {
      if (!event.active) currSimulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3Drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
  };

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

  // Initialize Graph Rendering & Events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let transform = { k: 1, x: 0, y: 0 };

    // Zoom and Pan Behavior
    const zoomBehavior = zoom()
      .scaleExtent([0.1, 2])
      .on("zoom", (event) => {
        transform = event.transform;
        draw(canvas, ctx, transform, graphData);
      });

    select(canvas).call(zoomBehavior);
    // .call(drag(simulation) as (selection: Selection<BaseType | SVGGElement, INode, SVGGElement, undefined>, ...args: unknown[]) => void);

    // Set Initial Zoom & Centering (Scale 0.1)
    const initialScale = 0.1; // force it to be zoomed out
    const initialX = canvas.width / 2;
    const initialY = canvas.height / 2;
    transform = zoomIdentity.translate(initialX, initialY).scale(initialScale);
    select(canvas).call(zoomBehavior.transform, transform);

    // Enable Features
    setupHoverEvents(canvas, transform, graphData);
    //setupDrag(canvas, ctx, transform, graphData);
    draw(canvas, ctx, transform, graphData);
  }, [graphData]);

  return (
    <div ref={forceGraphContainerRef} className="h-full w-full">
      {hoveredNode && (
        <div
          style={{
            position: "absolute",
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y - 15}px`,
            background: "white",
            padding: "10px",
            borderRadius: "4px",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)",
          }}
        >
          {hoveredNode.name} {hoveredNode.id}
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={forceGraphContainerRef.current?.clientWidth}
        height={forceGraphContainerRef.current?.clientHeight}
      />
    </div>
  );
};

export default ForceDirectedGraphView;

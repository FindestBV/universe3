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
import { D3DragEvent, drag, select, zoom, zoomIdentity, zoomTransform } from "d3";

import { FC, useCallback, useEffect, useRef, useState } from "react";

interface Node {
  id: string;
  x?: number;
  y?: number;
  name: string;
  objectType?: ObjectTypeEnum;
  lowerLevelNodes?: Node[];
}

interface Link {
  source: string | Node;
  target: string | Node;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface WorkerMessage {
  nodes: Node[];
  links: Link[];
}

const NODE_RADIUS = 30; // Node size

export const ForceDirectedGraphView: FC<{ linkingData: Node[]; id: string }> = ({
  linkingData,
  id,
}): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const forceGraphContainerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const graphDataRef = useRef<GraphData>({ nodes: [], links: [] });

  const draw = useCallback(
    (
      canvas: HTMLCanvasElement,
      ctx: CanvasRenderingContext2D,
      transform: { k: number; x: number; y: number },
      graphData: GraphData,
    ): void => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);

      // Draw Links
      graphData.links.forEach((link) => {
        const source = link.source as Node;
        const target = link.target as Node;
        ctx.moveTo(source.x ?? 0, source.y ?? 0);
        ctx.lineTo(target.x ?? 0, target.y ?? 0);
      });
      ctx.stroke();

      // Draw Nodes
      graphData.nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x ?? 0, node.y ?? 0, NODE_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = "#000000";
        ctx.fill();
      });

      ctx.restore();
    },
    [],
  );

  const drawCanvas = useCallback((): void => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const transform =
          zoomTransform(canvas) ?? zoomIdentity.translate(canvas.width / 2, canvas.height / 2);
        draw(canvas, ctx, transform, graphDataRef.current);
      }
    }
  }, [draw]);

  const dragstarted = useCallback(
    (event: D3DragEvent<HTMLCanvasElement, unknown, Node>): void => {
      event.sourceEvent.stopPropagation();
      GlobalGraphWorker.getWorker().postMessage({
        type: "nodeDragStarted",
        data: {
          nodeId: event.subject.id,
          graphId: id,
          x: event.subject.x,
          y: event.subject.y,
          shouldStart: !event.active,
        },
      });
    },
    [id],
  );

  const dragged = useCallback(
    (event: D3DragEvent<HTMLCanvasElement, unknown, Node>): void => {
      event.sourceEvent.stopPropagation();
      GlobalGraphWorker.getWorker().postMessage({
        type: "nodeDragged",
        data: { nodeId: event.subject.id, x: event.x, y: event.y, graphId: id },
      });
    },
    [id],
  );

  const dragended = useCallback(
    (event: D3DragEvent<HTMLCanvasElement, unknown, Node>): void => {
      event.sourceEvent.stopPropagation();
      GlobalGraphWorker.getWorker().postMessage({
        type: "nodeDragEnded",
        data: { nodeId: event.subject.id, graphId: id, shouldStart: !event.active },
      });
    },
    [id],
  );

  const dragsubject = useCallback((event: MouseEvent): Node | null => {
    if (!canvasRef.current) return null;
    const transform = zoomTransform(canvasRef.current);
    const x = transform.invertX(event.x);
    const y = transform.invertY(event.y);
    return (
      graphDataRef.current.nodes.find(
        (node) => Math.hypot((node.x ?? 0) - x, (node.y ?? 0) - y) < NODE_RADIUS,
      ) ?? null
    );
  }, []);

  const calculateFitTransform = useCallback(
    (graphData: GraphData, canvasWidth: number, canvasHeight: number) => {
      if (!graphData.nodes.length) return zoomIdentity;

      const nodes = graphData.nodes;
      const minX = Math.min(...nodes.map((node) => node.x ?? 0));
      const maxX = Math.max(...nodes.map((node) => node.x ?? 0));
      const minY = Math.min(...nodes.map((node) => node.y ?? 0));
      const maxY = Math.max(...nodes.map((node) => node.y ?? 0));

      const graphWidth = maxX - minX;
      const graphHeight = maxY - minY;

      const scale = Math.min(canvasWidth / graphWidth / 1.7, canvasHeight / graphHeight / 1.7);
      const translateX = (canvasWidth - graphWidth * scale) / 2 - minX * scale;
      const translateY = (canvasHeight - graphHeight * scale) / 2 - minY * scale;

      return zoomIdentity.translate(translateX, translateY).scale(scale);
    },
    [],
  );

  const setupZoomEvents = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void => {
      const zoomBehavior = zoom<HTMLCanvasElement, unknown>().on("zoom", (event) => {
        draw(canvas, ctx, event.transform, graphDataRef.current);
      });

      select<HTMLCanvasElement, unknown>(canvas).call(zoomBehavior);

      const calculatedTransform = calculateFitTransform(
        graphDataRef.current,
        canvas.width,
        canvas.height,
      );
      select<HTMLCanvasElement, unknown>(canvas).call(zoomBehavior.transform, calculatedTransform);
    },
    [draw, calculateFitTransform],
  );

  const setupDragEvents = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void => {
      select<HTMLCanvasElement, unknown>(canvas)
        .call(
          drag<HTMLCanvasElement, unknown>()
            .subject(dragsubject)
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended),
        )
        .call(
          zoom<HTMLCanvasElement, unknown>().on("zoom", () =>
            draw(canvas, ctx, zoomTransform(canvas) ?? zoomIdentity, graphDataRef.current),
          ),
        );
    },
    [draw, dragsubject, dragstarted, dragged, dragended],
  );

  const setupHoverEvents = useCallback((canvas: HTMLCanvasElement): void => {
    canvas.addEventListener("mousemove", (event: MouseEvent) => {
      if (!canvasRef.current) return;
      const transform = zoomTransform(canvasRef.current);
      const x = transform.invertX(event.offsetX);
      const y = transform.invertY(event.offsetY);
      const node = graphDataRef.current.nodes.find(
        (node) => Math.hypot((node.x ?? 0) - x, (node.y ?? 0) - y) < NODE_RADIUS,
      );
      if (node) {
        setHoveredNode(node);
        const screenX = (node.x ?? 0) * transform.k + transform.x;
        const screenY = (node.y ?? 0) * transform.k + transform.y;
        setMousePosition({ x: screenX, y: screenY });
      } else {
        setHoveredNode(null);
        setMousePosition({ x: 0, y: 0 });
      }
    });

    canvas.addEventListener("mouseleave", () => {
      setHoveredNode(null);
    });
  }, []);

  const setupCanvas = useCallback((): void => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        setupZoomEvents(canvas, ctx);
        setupDragEvents(canvas, ctx);
        setupHoverEvents(canvas);
      }
    }
  }, [setupZoomEvents, setupDragEvents, setupHoverEvents]);

  useEffect(() => {
    if (isInitialized) {
      setupCanvas();
    }
  }, [isInitialized, setupCanvas]);

  useEffect(() => {
    if (!linkingData || linkingData.length === 0) return;

    const graphWorker = GlobalGraphWorker.getWorker();

    const handleMessage = ({ nodes, links }: WorkerMessage) => {
      graphDataRef.current = { nodes, links };
      if (!isInitialized) {
        setIsInitialized(true);
      }
      if (isInitialized) {
        drawCanvas();
      }
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
  }, [linkingData, id, isInitialized, drawCanvas]);

  return (
    <div ref={forceGraphContainerRef} className="h-[800px] w-full">
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
          {hoveredNode.name}
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={forceGraphContainerRef.current?.clientWidth ?? 800}
        height={forceGraphContainerRef.current?.clientHeight ?? 800}
      />
    </div>
  );
};

export default ForceDirectedGraphView;

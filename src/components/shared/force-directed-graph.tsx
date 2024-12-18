import {
  drag as d3Drag,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  select,
  zoom,
} from "d3";
import { ILink, INode } from "Types";

import { FC, useEffect, useRef } from "react";

type TForceDirectedGraphViewProps = {
  initialNodes: INode[];
  initialLinks: ILink[];
};

export const ForceDirectedGraphView: FC<TForceDirectedGraphViewProps> = ({
  initialNodes,
  initialLinks,
}) => {
  const containerRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // Render force-directed graph
    const svg = select(containerRef.current);
    svg.selectAll("*").remove(); // Clear previous renders

    const width = 800;
    const height = 800;
    const nodes = [...initialNodes];
    const links = [...initialLinks];

    const simulation = forceSimulation(nodes)
      .force(
        "link",
        forceLink(links)
          .id((d: any) => d.id)
          .distance(100),
      )
      .force("charge", forceManyBody().strength(-500))
      .force("x", forceX(width / 2))
      .force("y", forceY(height / 2))
      .force("collision", forceCollide().radius(50));

    const zoomBehavior = zoom().on("zoom", (event) => {
      svgGroup.attr("transform", event.transform);
    });

    const svgGroup = svg
      .attr("viewBox", [0, 0, width, height].join(" "))
      .call(zoomBehavior)
      .append("g");

    const link = svgGroup
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", 2);

    const node = svgGroup
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("fill", "#000000")
      .call(
        d3Drag()
          .on("start", (event, d: INode) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d: INode) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d: INode) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      );

    node.append("title").text((d: INode) => d.data.text);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: ILink) => (d.source as INode).x!)
        .attr("y1", (d: ILink) => (d.source as INode).y!)
        .attr("x2", (d: ILink) => (d.target as INode).x!)
        .attr("y2", (d: ILink) => (d.target as INode).y!);

      node.attr("cx", (d: INode) => d.x!).attr("cy", (d: INode) => d.y!);
    });
  }, [initialNodes, initialLinks]);

  return (
    <div className="forceDirectionGraph">
      <svg ref={containerRef} style={{ width: "100%", height: "600px" }} />
    </div>
  );
};

export default ForceDirectedGraphView;

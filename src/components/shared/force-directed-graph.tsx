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

import { FC, useEffect, useRef } from "react";

type TForceDirectedGraphViewProps = {
  linkingData: any[];
};

export const ForceDirectedGraphView: FC<TForceDirectedGraphViewProps> = ({ linkingData }) => {
  const containerRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!Array.isArray(linkingData) || linkingData.length === 0) {
      console.warn("linkingData is empty or not an array");
      return;
    }

    const nodes = linkingData.map((data) => ({
      id: data.id,
      name: data.name,
      type: data.type,
    }));

    const links = linkingData.flatMap((data) =>
      (data.lowerLevelNodes || []).map((child) => ({
        source: data.id,
        target: child.id,
      })),
    );

    console.log("Nodes:", nodes);
    console.log("Links:", links);

    if (!nodes.length || !links.length) {
      console.warn("Transformed nodes or links are empty");
      return;
    }

    const svg = select(containerRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 800;

    svg.attr("width", width).attr("height", height);

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

    const svgGroup = svg.append("g").call(zoomBehavior);

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
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      );

    node.append("title").text((d) => d.name);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source?.x || 0)
        .attr("y1", (d) => d.source?.y || 0)
        .attr("x2", (d) => d.target?.x || 0)
        .attr("y2", (d) => d.target?.y || 0);

      node.attr("cx", (d) => d.x || 0).attr("cy", (d) => d.y || 0);
    });
  }, [linkingData]);

  return (
    <div className="forceDirectionGraph">
      <svg ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default ForceDirectedGraphView;

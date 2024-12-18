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
import { useNavigate } from "react-router-dom";

import { FindestButton } from "../utilities/findest-button";

type TForceDirectedGraphViewProps = {
  linkingData: { id: string; name: string; type: string; lowerLevelNodes?: { id: string }[] }[];
};

export const DataViewPanel: FC<TForceDirectedGraphViewProps> = ({ linkingData }) => {
  const containerRef = useRef<SVGSVGElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Array.isArray(linkingData) || linkingData.length === 0) {
      console.warn("Invalid or empty linkingData.");
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

    if (!nodes.length || !links.length) {
      console.warn("Nodes or links data is empty.");
      return;
    }

    const svg = select(containerRef.current);
    svg.selectAll("*").remove(); // Clear previous SVG content

    const width = 1000;
    const height = 1000;
    svg.attr("width", width).attr("height", height);
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    svg.style("width", "40%").style("height", "90%").style("margin", "0 auto");
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

    const svgGroup = svg.append("g").call(zoomBehavior as any);

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
      .style("cursor", "pointer")
      .call(
        d3Drag<SVGCircleElement, Node>()
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

    node
      .append("title")
      .text((d) => d.name)
      .on("click", (event, d) => {
        navigate(`/details/${d.id}`);
      })
      .on("mouseover", function () {
        select(this).attr("stroke", "yellow").attr("stroke-width", 2);
      })
      .on("mouseout", function () {
        select(this).attr("stroke", "white").attr("stroke-width", 1);
      });

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });
  }, [linkingData, navigate]);

  return (
    <div className="forceDirectedGraphContainer">
      <svg ref={containerRef} preserveAspectRatio="xMidYMid meet" />
    </div>
  );
};

export default DataViewPanel;

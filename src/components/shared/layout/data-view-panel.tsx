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
import Toolbar from "./toolbar";

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

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 1205 362`)
      .style("width", "100%")
      .style("height", "100%")
      .style("margin", "0 auto");

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
      .append("g")
      .attr(
        "transform",
        "translate(601.7406264847162,180.4767437749673) scale(0.03888504014419537)",
      ) // Apply transform
      .call(zoomBehavior as any);

    const link = svgGroup
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", (d) =>
        (d.source as any).type === "study" || (d.target as any).type === "study"
          ? "#007AFF"
          : "#CCCCCC",
      )
      .attr("stroke-width", (d) =>
        (d.source as any).type === "study" || (d.target as any).type === "study" ? 6 : 2,
      )
      .attr("stroke-linecap", "round");

    const node = svgGroup
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", (d) => (d.type === "entity" ? 30 : 10))
      .attr("fill", (d) => (d.type === "entity" ? "#0099CC" : "#000000"))
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
      .on("click", (event, d) => {
        navigate(`/details/${d.id}`);
      })
      .on("mouseover", function () {
        select(this).attr("stroke", "yellow").attr("stroke-width", 2);
      })
      .on("mouseout", function () {
        select(this).attr("stroke", null).attr("stroke-width", null);
      });

    node.append("title").text((d) => d.name);

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
      <div className="absolute left-0 top-[5em] p-4">
        <ul className="flex flex-col">
          <li className="flex flex-row items-center gap-2 text-sm text-gray-500">
            <span className="blueDot__indicator"></span>Entity
          </li>
          <li className="flex flex-row items-center gap-2 text-sm text-gray-500">
            <span className="purpleDot__indicator"></span>Study
          </li>
        </ul>
      </div>
      <svg ref={containerRef} preserveAspectRatio="xMidYMid meet" />
    </div>
  );
};

export default DataViewPanel;

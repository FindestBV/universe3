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

export enum ObjectTypeEnum {
  Unknown = 0,
  Entity = 1,
  Document = 2,
  Highlight = 3,
  Study = 4,
  Image = 5,
  ScienceArticle = 6,
  UsPatent = 7,
  Weblink = 8,
  MagPatent = 9,
  Comment = 10,
  File = 11,
  Tenant = 12,
  Organization = 13,
  Case = 14,
  Query = 15,
}

type TForceDirectedGraphViewProps = {
  linkingData: {
    id: string;
    name: string;
    type: string;
    objectType: number;
    lowerLevelNodes?: { id: string }[];
  }[];
};

export const ForceDirectedGraphView: FC<TForceDirectedGraphViewProps> = ({
  linkingData,
  searchKeyword,
}) => {
  const containerRef = useRef<SVGSVGElement | null>(null);
  const navigate = useNavigate();
  console.log("search", searchKeyword);
  const colorMap: Record<number, string> = {
    [ObjectTypeEnum.Entity]: "#0099CC", // Blue
    [ObjectTypeEnum.Study]: "#800080", // Purple
    [ObjectTypeEnum.Unknown]: "#CCCCCC", // Gray for unknown
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const typeLabels: Record<number, string> = {
    [ObjectTypeEnum.Entity]: "Entity",
    [ObjectTypeEnum.Study]: "Study",
    [ObjectTypeEnum.Unknown]: "Unknown",
  };

  useEffect(() => {
    if (!Array.isArray(linkingData) || linkingData.length === 0) {
      console.warn("Invalid or empty linkingData.");
      return;
    }

    const nodes = linkingData.map((data) => ({
      id: data.id,
      name: data.name,
      type: data.type,
      objectType: data.objectType,
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
      .attr("viewBox", `0 0 600 250`)
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
      .attr("transform", "translate(282.0683290021384,102.7027043871232) scale(0.05)") // Apply transform
      .call(zoomBehavior as any);

    // Render Links
    const link = svgGroup
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#CCCCCC")
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round");

    // Render Nodes
    const node = svgGroup
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("fill", (d) => colorMap[d.objectType] || "#000000")
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
        navigate(`/${d.type}/${d.id}`);
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

  useEffect(() => {
    console.log("ForceDirectedGraphView props:", { linkingData, searchKeyword });
  }, [linkingData, searchKeyword]);

  return (
    <>
      {/* Your Existing Legend */}
      <div className="absolute left-[1em] top-[3em] p-4">
        <ul className="flex flex-col">
          <li className="flex flex-row items-center gap-2 text-sm text-gray-500">
            <span className="blueDot__indicator"></span>Entity
          </li>
          <li className="flex flex-row items-center gap-2 text-sm text-gray-500">
            <span className="purpleDot__indicator"></span>Study
          </li>
        </ul>
      </div>

      {/* Graph Container */}
      <div className="forceDirectedGraphContainer">
        <svg ref={containerRef} />
      </div>
    </>
  );
};

export default ForceDirectedGraphView;

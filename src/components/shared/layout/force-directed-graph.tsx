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

import { FC, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export enum ObjectTypeEnum {
  Unknown = 0,
  Entity = 1,
  Document = 2,
  Highlight = 3,
  Study = 4,
}

type TForceDirectedGraphViewProps = {
  linkingData: {
    id: string;
    name: string;
    type: string;
    objectType: number;
    lowerLevelNodes?: { id: string }[];
  }[];
  searchKeyword?: string;
};

export const ForceDirectedGraphView: FC<TForceDirectedGraphViewProps> = ({
  linkingData = [],
  searchKeyword = "",
}) => {
  const containerRef = useRef<SVGSVGElement | null>(null);
  const navigate = useNavigate();

  const colorMap: Record<number, string> = {
    [ObjectTypeEnum.Entity]: "#0099CC", // Blue
    [ObjectTypeEnum.Study]: "#800080", // Purple
    [ObjectTypeEnum.Unknown]: "#CCCCCC", // Gray
  };

  // Filter Graph Data
  const filterGraphData = useCallback(() => {
    const lowerKeyword = searchKeyword.toLowerCase();

    const filteredNodes = linkingData.reduce((acc: any[], node: any) => {
      const newLowerLevelNodes = (node.lowerLevelNodes || []).filter((child: any) =>
        child.id?.toLowerCase().includes(lowerKeyword),
      );

      if (node.name?.toLowerCase().includes(lowerKeyword) || newLowerLevelNodes.length > 0) {
        acc.push({ ...node, lowerLevelNodes: newLowerLevelNodes });
      }

      return acc;
    }, []);

    const nodeIds = new Set(filteredNodes.map((node) => node.id));

    const filteredLinks = linkingData.flatMap((node) =>
      (node.lowerLevelNodes || [])
        .filter((child) => nodeIds.has(child.id))
        .map((child) => ({
          source: node.id,
          target: child.id,
        })),
    );

    return { nodes: filteredNodes, links: filteredLinks };
  }, [linkingData, searchKeyword]);

  useEffect(() => {
    const { nodes, links } = filterGraphData();

    if (!nodes.length || !links.length) {
      console.warn("No nodes or links available to render.");
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
      .attr("transform", "translate(282.0683290021384,102.7027043871232) scale(0.05)")
      .call(zoomBehavior);

    // Render links
    const link = svgGroup
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", (d) =>
        nodes.find((node) => node.id === d.source)?.isHighlighted ||
        nodes.find((node) => node.id === d.target)?.isHighlighted
          ? "#007AFF"
          : "#CCCCCC",
      )
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round");

    // Render nodes
    const node = svgGroup
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", (d) => (d.isHighlighted ? 12 : 10))
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
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
    });
  }, [filterGraphData, navigate]);

  return (
    <>
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

      <div className="forceDirectedGraphContainer">
        <svg ref={containerRef} />
      </div>
    </>
  );
};

export default ForceDirectedGraphView;

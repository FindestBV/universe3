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
    lowerLevelNodes?: { id: string; name: string }[];
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

  const filterGraphData = useCallback(() => {
    const lowerKeyword = searchKeyword.toLowerCase();

    // Filter nodes and their children based on the search keyword
    const filteredNodes = linkingData.reduce((acc: any[], node: any) => {
      const newLowerLevelNodes = (node.lowerLevelNodes || []).filter((child: any) =>
        child.name.toLowerCase().includes(lowerKeyword),
      );

      // Include node if it matches the keyword or has matching children
      if (node.name.toLowerCase().includes(lowerKeyword) || newLowerLevelNodes.length > 0) {
        acc.push({ ...node, lowerLevelNodes: newLowerLevelNodes });
      }

      return acc;
    }, []);

    // Create a set of IDs for filtered nodes
    const filteredNodeIds = new Set(filteredNodes.map((node) => node.id));

    // Create links based on the filtered nodes
    const filteredLinks = filteredNodes.flatMap((node) =>
      (node.lowerLevelNodes || [])
        .filter((child) => filteredNodeIds.has(child.id))
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

    const link = svgGroup
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#CCCCCC")
      .attr("stroke-width", 2);

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
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
    });
  }, [filterGraphData, navigate]);

  return (
    <>
      <div className="forceDirectedGraphContainer">
        <svg ref={containerRef} />
      </div>
    </>
  );
};

export default ForceDirectedGraphView;

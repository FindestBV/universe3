import {
  drag as d3Drag,
  hsl as d3Hsl,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  select,
  zoom,
  zoomIdentity,
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

  const calculateNodeColor = (objectType: number): string => {
    const baseColor =
      objectType === ObjectTypeEnum.Entity
        ? "#0099CC"
        : objectType === ObjectTypeEnum.Study
          ? "#800080"
          : "#CCCCCC";

    const color = d3Hsl(baseColor);
    color.l += 0.1;
    return color.toString();
  };

  const filterGraphData = useCallback(() => {
    const lowerKeyword = searchKeyword.toLowerCase();

    const filteredNodes = linkingData.reduce((acc: any[], node: any) => {
      const newLowerLevelNodes = (node.lowerLevelNodes || []).filter((child: any) =>
        child.name?.toLowerCase()?.includes(lowerKeyword),
      );

      if (node.name?.toLowerCase()?.includes(lowerKeyword) || newLowerLevelNodes.length > 0) {
        acc.push({ ...node, lowerLevelNodes: newLowerLevelNodes });
      }

      return acc;
    }, []);

    const filteredNodeIds = new Set(filteredNodes.map((node) => node.id));

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

    svg.attr("width", width).attr("height", height).style("width", "100%").style("height", "100%");

    const svgGroup = svg.append("g");

    const simulation = forceSimulation(nodes)
      .force(
        "link",
        forceLink(links)
          .id((d: any) => d.id)
          .distance(150),
      )
      .force("charge", forceManyBody().strength(-300))
      .force("x", forceX(width / 2))
      .force("y", forceY(height / 2))
      .force("collision", forceCollide().radius(40));

    const zoomBehavior = zoom()
      .scaleExtent([0.1, 5]) // Allow zooming out and in dynamically
      .on("zoom", (event) => {
        svgGroup.attr("transform", event.transform);
      });

    svg.call(zoomBehavior);

    const link = svgGroup
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#CCCCCC")
      .attr("stroke-width", 1.5);

    const node = svgGroup
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 12)
      .attr("fill", (d) => calculateNodeColor(d.objectType))
      .style("cursor", "pointer")
      .call(
        d3Drag<SVGCircleElement, any>()
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

    // Set the initial transformation to `translate(360, 360) scale(0.2)`
    svgGroup.attr("transform", "translate(360,360) scale(0.2)");

    // Add click and hover interactions
    node
      .on("click", (event, d) => {
        svg
          .transition()
          .duration(750)
          .call(
            zoomBehavior.transform,
            zoomIdentity.translate(width / 2 - d.x * 1.5, height / 2 - d.y * 1.5).scale(1.5),
          );

        const rewrite = d.type === "Study" ? "studies" : "entities";
        navigate(`/library/${rewrite}/${d.id}`);
      })
      .on("mouseover", function () {
        select(this).attr("stroke", "yellow").attr("stroke-width", 2);
      })
      .on("mouseout", function () {
        select(this).attr("stroke", null).attr("stroke-width", null);
      });

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
    <div className="forceDirectedGraphContainer">
      <svg ref={containerRef} />
    </div>
  );
};

export default ForceDirectedGraphView;

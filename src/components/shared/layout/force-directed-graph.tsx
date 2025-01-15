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
  zoomIdentity,
} from "d3";

import { FC, useEffect, useRef } from "react";

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
  isDashBoard?: boolean;
};

export const ForceDirectedGraphView: FC<TForceDirectedGraphViewProps> = ({
  linkingData = [],
  searchKeyword = "",
  isDashBoard,
}) => {
  const containerRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!linkingData || linkingData.length === 0) {
      console.warn("No data provided for rendering.");
      return;
    }

    const svg = select(containerRef.current);
    svg.selectAll("*").remove(); // Clear previous SVG content

    const width = containerRef.current?.clientWidth || 1000;
    const height = containerRef.current?.clientHeight || 1000;

    svg
      .attr("viewBox", [-width / 2, -height / 2, width, height].join(" "))
      .attr("style", "width: 100%; height: 100%; background-color: white;");

    const svgGroup = svg.append("g");

    const nodes = linkingData.map((node) => ({ ...node }));
    const links = linkingData.flatMap((node) =>
      (node.lowerLevelNodes || []).map((child) => ({
        source: node.id,
        target: child.id,
      })),
    );

    const simulation = forceSimulation(nodes)
      .force(
        "link",
        forceLink(links)
          .id((d: any) => d.id)
          .distance(100),
      )
      .force("charge", forceManyBody().strength(-300))
      .force("x", forceX())
      .force("y", forceY())
      .force("collision", forceCollide(30));

    const zoomBehavior = zoom()
      .scaleExtent([0.1, 5])
      .on("zoom", (event) => {
        svgGroup.attr("transform", event.transform);
      });

    svg.call(zoomBehavior);

    const link = svgGroup
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5);

    const node = svgGroup
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 12)
      .attr("fill", (d) =>
        d.objectType === ObjectTypeEnum.Entity
          ? "#0099CC"
          : d.objectType === ObjectTypeEnum.Study
            ? "#800080"
            : "#CCCCCC",
      )
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

    // Zoom to node on click
    node.on("click", (event, d) => {
      svg
        .transition()
        .duration(750)
        .call(
          zoomBehavior.transform,
          zoomIdentity.translate(width / 2 - d.x * 1.5, height / 2 - d.y * 1.5).scale(1.5),
        );
    });

    node
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

    // Custom scale and translation
    const bounds = svgGroup.node()?.getBBox();
    if (bounds) {
      const fullWidth = bounds.width;
      const fullHeight = bounds.height;
      const midX = bounds.x + fullWidth / 2;
      const midY = bounds.y + fullHeight / 2;

      // Custom scaling and translation
      const customScale = isDashBoard ? 0.075 : 0.2; // Adjust this for your preferred scale
      const customTranslateX = 0; // Adjust this for horizontal centering
      const customTranslateY = 0; // Adjust this for vertical centering

      svg.call(
        zoomBehavior.transform,
        zoomIdentity
          .translate(customTranslateX - midX * customScale, customTranslateY - midY * customScale)
          .scale(customScale),
      );
    }
  }, [linkingData]);

  return (
    <div style={{ width: "auto", height: "100vh" }}>
      <svg ref={containerRef} />
    </div>
  );
};

export default ForceDirectedGraphView;

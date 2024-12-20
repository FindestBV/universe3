import { TTypeGraphNodeDTO } from "@/types/types";
import {
  hsl as d3Hsl,
  hierarchy,
  HierarchyCircularNode,
  pack,
  scaleOrdinal,
  select,
  zoom,
} from "d3";

import { FC, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const PackGraphView: FC<{ data?: TTypeGraphNodeDTO[]; searchKeyword?: string }> = ({
  data,
  searchKeyword,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const navigateToObject = (object: { objectType: number; id: string }) => {
    navigate(`/library/${object.objectType === 1 ? "entities" : "studies"}/${object.id}`);
  };

  const getModifiedDataForTypeGraph = (typeData: TTypeGraphNodeDTO[]) => {
    const entities = typeData.filter((d) => d.objectType === 1);
    const studies = typeData.filter((d) => d.objectType === 4);
    return {
      name: "PackData",
      children: [
        { name: "ENTITY", children: entities },
        { name: "STUDY", children: studies },
      ],
    };
  };

  useEffect(() => {
    if (!data?.length) return;

    const container = containerRef.current;
    if (!container) return;

    // Clear existing SVG
    select(container).selectAll("svg").remove();

    // Dimensions and data preparation
    const width = container.offsetWidth || 800;
    const height = container.offsetHeight || 600;

    const modifiedData = getModifiedDataForTypeGraph(data);
    const root = pack<TTypeGraphNodeDTO>().size([width, height]).padding(10)(
      hierarchy(modifiedData).sum((d) => d.size || 1),
    );

    // Create the SVG with full width and height
    const svg = select(container)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "100%");

    // Zoom behavior
    const zoomBehavior = zoom().on("zoom", (event) => {
      svgGroup.attr("transform", event.transform);
    });
    svg.call(zoomBehavior);

    // Add group for zoomable elements
    const svgGroup = svg.append("g");

    const color = scaleOrdinal<string>().domain(["ENTITY", "STUDY"]).range(["#0099CC", "#800080"]);

    // Tooltip setup
    const tooltip = select(container)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("padding", "5px")
      .style("border-radius", "4px")
      .style("box-shadow", "0 0 5px rgba(0, 0, 0, 0.3)")
      .style("z-index", "10");

    // Draw circles
    svgGroup
      .selectAll("circle")
      .data(root.descendants())
      .enter()
      .append("circle")
      .attr("fill", (d) => color(d.depth === 1 ? d.data.name : "ENTITY") || "#000")
      .attr("stroke", "white")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => d.r)
      .style("cursor", "pointer")
      .on("click", (_, d: HierarchyCircularNode<TTypeGraphNodeDTO>) => {
        if (d.data.id) navigateToObject({ objectType: d.data.objectType, id: d.data.id });
      })
      .on("mouseover", function (event, d) {
        tooltip
          .text(d.data.name)
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`)
          .style("visibility", "visible");
        select(this).attr("stroke", "yellow").attr("stroke-width", 2);
      })
      .on("mousemove", (event) => {
        tooltip.style("top", `${event.pageY - 10}px`).style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        select(this).attr("stroke", "white").attr("stroke-width", 1);
      });

    // Add labels for top-level nodes
    svgGroup
      .selectAll("text")
      .data(root.descendants().filter((d) => d.depth === 1))
      .enter()
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "#252525")
      .style("font-family", "IBM Plex Sans, sans-serif")
      .style("font-weight", "bold")
      .text((d) => d.data?.name);
  }, [data]);

  return (
    <div
      className="packGraphContainer"
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
};

export default PackGraphView;

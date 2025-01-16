import { TTypeGraphNodeDTO } from "@/types/types";
import {
  hsl as d3Hsl,
  hierarchy,
  HierarchyCircularNode,
  pack,
  scaleOrdinal,
  select,
  zoom,
  zoomIdentity,
} from "d3";

import { FC, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

type TTypeGraphViewProps = {
  data?: TTypeGraphNodeDTO[];
  searchKeyword?: string;
};

export const PackGraphView: FC<TTypeGraphViewProps> = ({ data, searchKeyword, isDashBoard }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  /**
   * Prepare data for the graph: groups nodes by "ENTITY" and "STUDY," filtered by the search keyword.
   */
  const getModifiedDataForTypeGraph = (typeData: TTypeGraphNodeDTO[] = [], keyword: string) => {
    const lowerKeyword = keyword.toLowerCase();

    const filteredData = typeData.map((node) => ({
      ...node,
      children: (node.children || []).filter((child) =>
        child.name?.toLowerCase().includes(lowerKeyword),
      ),
    }));

    const entityGroup = {
      name: "ENTITY",
      children: filteredData.filter((node) => node.objectType === 1),
    };

    const studyGroup = {
      name: "STUDY",
      children: filteredData.filter((node) => node.objectType === 4),
    };

    return {
      name: "PackData",
      children: [entityGroup, studyGroup],
    };
  };

  useEffect(() => {
    if (!data || !data.length) return;

    const container = containerRef.current;
    if (!container) return;

    // Clear existing SVG content
    select(container).selectAll("svg").remove();

    const modifiedData = getModifiedDataForTypeGraph(data, searchKeyword || "");

    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 1000;

    // Create hierarchical data and pack layout
    const root = pack<TTypeGraphNodeDTO>().size([width, height]).padding(8)(
      hierarchy(modifiedData).sum((d) => d.size || 1),
    );

    let focus = root;
    let view = [root.x, root.y, root.r * 2];

    // Create the SVG element
    const svg = select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .style("background-color", "white");

    const svgGroup = svg.append("g");

    const color = scaleOrdinal<string>()
      .domain(["ENTITY", "STUDY", "PackData"])
      .range(["#0099CC", "#800080", "rgb(242, 244, 248)"]);

    const calculateColor = (d: HierarchyCircularNode<TTypeGraphNodeDTO>) => {
      let parent = d;
      while (parent.depth > 1 && parent.parent) {
        parent = parent.parent;
      }
      const baseColor = color(parent.data.name) || "#0099cc";
      const modifiedColor = d3Hsl(baseColor);
      modifiedColor.l += d.depth === 1 ? 0 : d.depth * 0.1;
      return modifiedColor.toString();
    };

    const zoomBehavior = zoom()
      .scaleExtent([0.1, 5])
      .on("zoom", (event) => {
        svgGroup.attr("transform", event.transform);
      });

    // svg.call(zoomBehavior);

    /**
     * Function to zoom and adjust element positions dynamically.
     */
    const zoomTo = (v: [number, number, number], isInitial = false) => {
      const k = width / v[2];
      view = v;

      const transition = isInitial ? svgGroup : svgGroup.transition().duration(750);

      transition
        .selectAll("circle")
        .attr("cx", (d) => (d.x - v[0]) * k)
        .attr("cy", (d) => (d.y - v[1]) * k)
        .attr("r", (d) => d.r * k);

      transition
        .selectAll("text")
        .attr("x", (d) => (d.x - v[0]) * k)
        .attr("y", (d) => (d.y - v[1]) * k)
        .text((d) =>
          d === focus
            ? d.data.name || ""
            : d.parent === focus
              ? d.data.name === "ENTITY" || d.data.name === "STUDY"
                ? d.data.name
                : d.data.name?.charAt(0) || ""
              : "",
        )
        .style("fill-opacity", (d) => (d === focus || d.parent === focus ? 1 : 0))
        .style("font-size", (d) => (d === focus ? "16px" : d.parent === focus ? "12px" : "8px"));
    };

    // Add circles for nodes
    svgGroup
      .selectAll("circle")
      .data(root.descendants())
      .enter()
      .append("circle")
      .attr("fill", (d) => calculateColor(d))
      .attr("stroke", "white")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => d.r)
      .style("cursor", "pointer")
      .on("mouseover", function () {
        select(this).attr("stroke", "yellow").attr("stroke-width", 2);
      })
      .on("mouseout", function () {
        select(this).attr("stroke", "white").attr("stroke-width", 1);
      })
      .on("click", (event, d) => {
        focus = d;
        zoomTo([focus.x, focus.y, focus.r * 2]);
      });

    // Add text labels for nodes
    svgGroup
      .selectAll("text")
      .data(root.descendants().filter((d) => d.data.name !== "PackData"))
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .style("font-size", "8px")
      .style("fill-opacity", 0)
      .text("");

    // Fit and center the graph initially
    // Fit and center the graph initially
    const bounds = svgGroup.node()?.getBBox();
    if (bounds) {
      const fullWidth = bounds.width;
      const fullHeight = bounds.height;
      const midX = bounds.x + fullWidth / 2;
      const midY = bounds.y + fullHeight / 2;

      const scale = isDashBoard ? 0.5 : Math.min(width / fullWidth, height / fullHeight) * 0.5;
      const translateX = isDashBoard ? 0 : 0;
      const translateY = isDashBoard ? 0 : 0;
      svg.call(zoomBehavior.transform, zoomIdentity.translate(translateX, translateY).scale(scale));
    }

    zoomTo([root.x, root.y, root.r * 2], true);
  }, [data, searchKeyword]);

  return (
    <div className="packGraphDashboard">
      <div ref={containerRef} className="packGraphContainer p-4" id="packGraph" />
    </div>
  );
};

export default PackGraphView;

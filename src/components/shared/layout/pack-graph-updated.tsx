import { TTypeGraphNodeDTO } from "@/types/types";
import { hsl as d3Hsl, hierarchy, HierarchyCircularNode, pack, scaleOrdinal, select } from "d3";

import { FC, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

type TTypeGraphViewProps = {
  data?: TTypeGraphNodeDTO[];
  searchKeyword?: string;
};

export const PackGraphViewUpdated: FC<TTypeGraphViewProps> = ({ data, searchKeyword }) => {
  const containerRef = useRef<HTMLDivElement>(null); // Reference for the graph container
  const navigate = useNavigate(); // Navigation hook for redirection

  /**
   * Prepares the graph data by grouping nodes and filtering based on the keyword.
   * Groups are created for "ENTITY" and "STUDY" and filtered by the search keyword.
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
      name: "PackData", // Root node, not displayed
      children: [entityGroup, studyGroup],
    };
  };

  useEffect(() => {
    if (!data || !data.length) return; // Exit if no data is provided

    const container = containerRef.current;
    if (!container) return;

    // Clear existing SVG content
    select(container).selectAll("svg").remove();

    const modifiedData = getModifiedDataForTypeGraph(data, searchKeyword || "");

    // Set graph dimensions
    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 1000;

    // Create a hierarchical data structure and pack layout
    const root = pack<TTypeGraphNodeDTO>().size([width, height]).padding(8)(
      hierarchy(modifiedData).sum((d) => d.size || 1),
    );

    let focus = root; // Current focus node
    let view = [root.x, root.y, root.r * 2]; // Initial view dimensions

    // Create the SVG element for the graph
    const svg = select(container)
      .append("svg")
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "white");

    const svgGroup = svg.append("g"); // Group for circles and labels

    // Define a color scale for the different node categories
    const color = scaleOrdinal<string>()
      .domain(["ENTITY", "STUDY", "PackData"])
      .range(["#0099CC", "#800080", "rgb(242, 244, 248)"]);

    /**
     * Determines the color of each node based on its depth and type.
     */
    const calculateColor = (d: HierarchyCircularNode<TTypeGraphNodeDTO>) => {
      let parent = d;
      while (parent.depth > 1 && parent.parent) {
        parent = parent.parent;
      }
      const baseColor = color(parent.data.name) || "#0099cc";
      const modifiedColor = d3Hsl(baseColor);
      modifiedColor.l += d.depth === 1 ? 0 : d.depth * 0.1; // Lighten the color for deeper nodes
      return modifiedColor.toString();
    };

    /**
     * Zooms to a node and adjusts the position and visibility of the elements.
     */
    const zoomTo = (v: [number, number, number]) => {
      const k = width / v[2]; // Scale factor
      view = v;

      // Transition circles to their new positions and sizes
      svgGroup
        .selectAll("circle")
        .transition()
        .duration(750)
        .attr("cx", (d) => (d.x - v[0]) * k)
        .attr("cy", (d) => (d.y - v[1]) * k)
        .attr("r", (d) => d.r * k);

      // Transition text to their new positions and adjust visibility and content
      svgGroup
        .selectAll("text")
        .transition()
        .duration(750)
        .attr("x", (d) => (d.x - v[0]) * k)
        .attr("y", (d) => (d.y - v[1]) * k)
        .text((d) =>
          d === focus
            ? d.data.name || "" // Show full name if fully zoomed in
            : d.parent === focus
              ? d.data.name === "ENTITY" || d.data.name === "STUDY"
                ? d.data.name // Always show "ENTITY" and "STUDY" labels fully
                : d.data.name?.charAt(0) || "" // Show first character for group children
              : "",
        )
        .style("fill-opacity", (d) => (d === focus || d.parent === focus ? 1 : 0)) // Set opacity based on visibility
        .style("font-size", (d) => (d === focus ? "16px" : d.parent === focus ? "12px" : "8px")); // Adjust font size
    };

    // Add circles for each node
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
        select(this).attr("stroke", "yellow").attr("stroke-width", 2); // Highlight on hover
      })
      .on("mouseout", function () {
        select(this).attr("stroke", "white").attr("stroke-width", 1); // Reset highlight on mouse out
      })
      .on("click", (event, d) => {
        focus = d; // Update the focus node
        zoomTo([focus.x, focus.y, focus.r * 2]); // Zoom to the clicked node
      });

    // Add text labels for each node
    svgGroup
      .selectAll("text")
      .data(root.descendants().filter((d) => d.data.name !== "PackData")) // Exclude "PackData" label
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .style("font-size", "8px")
      .style("fill-opacity", 0) // Start hidden
      .text(""); // Initialize with empty text

    // Initialize zoom to the root node
    zoomTo([root.x, root.y, root.r * 2]);
  }, [data, searchKeyword]);

  return (
    <div className="packGraphDashboard">
      <div ref={containerRef} className="packGraphContainer p-4" id="packGraph" />
    </div>
  );
};

export default PackGraphViewUpdated;

import { TTypeGraphNodeDTO } from "@/types/types";
import {
  hsl as d3Hsl,
  zoom as d3Zoom,
  hierarchy,
  HierarchyCircularNode,
  pack,
  scaleOrdinal,
  select,
} from "d3";

import { FC, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

type TTypeGraphViewProps = {
  data?: TTypeGraphNodeDTO[];
  searchKeyword?: string;
};

export const PackGraphViewUpdated: FC<TTypeGraphViewProps> = ({ data, searchKeyword }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const navigateToObject = (object: { objectType: number; id: string }) => {
    if (object.objectType === 1) {
      navigate(`/library/entities/${object.id}`);
    } else if (object.objectType === 4) {
      navigate(`/library/studies/${object.id}`);
    }
  };

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

    select(container).selectAll("svg").remove();

    const modifiedData = getModifiedDataForTypeGraph(data, searchKeyword || "");

    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 1000;

    const root = pack<TTypeGraphNodeDTO>().size([width, height]).padding(8)(
      hierarchy(modifiedData).sum((d) => d.size || 1),
    );

    let focus = root;
    let view = [root.x, root.y, root.r * 2];

    const svg = select(container)
      .append("svg")
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "white")
      .on("click", () => zoomTo([root.x, root.y, root.r * 2]));

    const svgGroup = svg.append("g");

    const label = svg
      .append("text")
      .attr("class", "zoom-label")
      .attr("text-anchor", "middle")
      .attr("x", 0)
      .attr("y", -height / 2 + 40)
      .style("font-size", "24px")
      .style("fill", "#333")
      .style("font-weight", "bold")
      .style("visibility", "hidden");

    const zoomTo = (v: [number, number, number]) => {
      const k = width / v[2];
      view = v;

      label.style("visibility", focus === root ? "hidden" : "visible").text(focus.data.name || "");

      svgGroup
        .selectAll("circle")
        .attr("cx", (d) => (d.x - v[0]) * k)
        .attr("cy", (d) => (d.y - v[1]) * k)
        .attr("r", (d) => d.r * k);

      svgGroup
        .selectAll("text")
        .attr("x", (d) => (d.x - v[0]) * k)
        .attr("y", (d) => (d.y - v[1]) * k);
    };

    const color = scaleOrdinal<string>()
      .domain(["ENTITY", "STUDY", "PackData"])
      .range(["#0099CC", "#800080", "rgb(242, 244, 248)"]);

    const calculateColor = (d: HierarchyCircularNode<TTypeGraphNodeDTO>) => {
      const depth = d.depth;
      while (d.depth > 1 && d.parent) {
        d = d.parent;
      }
      const baseColor = color(d.data.name) || "#0099cc";
      const modifiedColor = d3Hsl(baseColor);
      modifiedColor.l += depth === 1 ? 0 : depth * 0.1;
      return modifiedColor.toString();
    };

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
      .on("click", (event, d) => {
        event.stopPropagation();
        focus = d;
        zoomTo([focus.x, focus.y, focus.r * 2]);
      })
      .on("mouseover", function () {
        select(this).attr("stroke", "yellow").attr("stroke-width", 2);
      })
      .on("mouseout", function () {
        select(this).attr("stroke", "white").attr("stroke-width", 1);
      });

    svgGroup
      .selectAll("text")
      .data(root.descendants().filter((d) => d.data.name === "ENTITY" || d.data.name === "STUDY"))
      .enter()
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "#252525")
      .style("font-family", "IBM Plex Sans, sans-serif")
      .style("font-weight", "bold")
      .text((d) => d.data?.name);

    zoomTo([root.x, root.y, root.r * 2]);
  }, [data, searchKeyword]);

  return (
    <div className="packGraphDashboard">
      <div ref={containerRef} className="packGraphContainer p-4" id="packGraph" />
    </div>
  );
};

export default PackGraphViewUpdated;

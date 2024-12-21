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

type TTypeGraphViewProps = {
  data?: TTypeGraphNodeDTO[];
  searchKeyword?: string;
};

export const PackGraphView: FC<TTypeGraphViewProps> = ({ data, searchKeyword }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const navigateToObject = (object: { objectType: ObjectTypeEnum; id: string }) => {
    if (object.objectType === ObjectTypeEnum.Entity) {
      navigate(`/library/entities/${object.id}`);
    } else if (object.objectType === ObjectTypeEnum.Study) {
      navigate(`/library/studies/${object.id}`);
    }
  };

  const getModifiedDataForTypeGraph = (typeData: TTypeGraphNodeDTO[] = [], keyword: string) => {
    const lowerKeyword = keyword.toLowerCase();

    const filteredData = typeData.map((a) => ({
      ...a,
      children: (a.children || []).filter(
        (child) => child.name?.toLowerCase().includes(lowerKeyword), // Check child.name exists
      ),
    }));

    const test = filteredData.map((a) => ({
      ...a,
      name: a.type || "Unnamed", // Ensure `a.type` is valid
      children: (a.children || []).map((c) => ({
        ...c,
        objectType: a.objectType,
        size: (a.children || []).length,
      })),
    }));

    const entitygroups = test
      .filter((d) => d.objectType === ObjectTypeEnum.Entity && d.name !== "Entity")
      .map((a) => ({
        ...a,
        children: (a.children || []).map((c) => ({ ...c, size: (a.children || []).length })),
      }));

    const singleEntities = test
      .find((d) => d.name === "Entity")
      ?.children?.map((a) => ({
        ...a,
        size: 1,
      }));

    const entityGroup = {
      name: "ENTITY",
      children: [...entitygroups, ...(singleEntities ?? [])],
    };

    const studyGroups = test
      .filter((d) => d.objectType === ObjectTypeEnum.Study && d.name !== "Study")
      .map((a) => ({
        ...a,
        children: (a.children || []).map((c) => ({ ...c, size: (a.children || []).length })),
      }));

    const singleStudies = test
      .find((d) => d.name === "Study")
      ?.children?.map((a) => ({
        ...a,
        size: 1,
      }));

    const studyGroup = {
      name: "STUDY",
      children: [...studyGroups, ...(singleStudies ?? [])],
    };

    return {
      name: "PackData",
      size: 1,
      children: [
        entityGroup.children.length > 0 ? entityGroup : null,
        studyGroup.children.length > 0 ? studyGroup : null,
      ].filter((a) => a),
    };
  };

  useEffect(() => {
    if (!data || !data.length) return;

    const container = containerRef.current;
    if (!container) return;

    // Clear previous SVG
    select(container).selectAll("svg").remove();

    const modifiedData = getModifiedDataForTypeGraph(data, searchKeyword || "");

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const root = pack<TTypeGraphNodeDTO>().size([width, height]).padding(8)(
      hierarchy(modifiedData).sum((d) => d.size || 1),
    );

    const svg = select(container)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("width", "100%")
      .style("height", "100%")
      .call(
        zoom().on("zoom", (event) => {
          svgGroup.attr("transform", event.transform);
        }),
      );

    const svgGroup = svg.append("g");

    const color = scaleOrdinal<string>()
      .domain(["ENTITY", "STUDY", "PackData"])
      .range(["#0099CC", "#800080", "rgb(242, 244, 248)"]); // Updated first circle color

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

    // Tooltip
    const tooltip = select(container)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("padding", "5px")
      .style("border-radius", "4px")
      .style("box-shadow", "0px 0px 5px rgba(0, 0, 0, 0.3)")
      .style("z-index", "10");

    // Draw circles
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

    // Add labels for ENTITY and STUDY only
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
  }, [data, searchKeyword, navigate]);

  return (
    <div className="packGraphDashboard">
      <div ref={containerRef} className="packGraphContainer p-4" id="packGraph" />
    </div>
  );
};

export default PackGraphView;

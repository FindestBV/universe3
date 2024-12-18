import { ObjectTypeEnum, TTypeGraphNodeDTO } from "@/types/types";
import { hierarchy, HierarchyCircularNode, hsl, pack, scaleOrdinal, select, zoom } from "d3";

import { FC, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { FindestButton } from "./findest-button";

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

  useEffect(() => {
    if (!data || !data.length) return;

    const container = containerRef.current;
    if (!container) return;

    // Clear previous SVG
    select(container).selectAll("svg").remove();

    const filteredData = data.map((node) => ({
      ...node,
      children: node.children?.filter((child) =>
        searchKeyword ? child.name.toLowerCase().includes(searchKeyword.toLowerCase()) : true,
      ),
    }));

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const root = pack<TTypeGraphNodeDTO>().size([width, height]).padding(8)(
      hierarchy({ name: "root", children: filteredData }).sum((d) => d.size || 1),
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

    const color = scaleOrdinal<number, string>()
      .domain([0, 1, 2, 3])
      .range(["#ff4d4d", "#0099cc", "#33cc33", "#ffcc00"]);

    // Draw circles
    svgGroup
      .selectAll("circle")
      .data(root.descendants())
      .enter()
      .append("circle")
      .attr("fill", (d, i) => (d.children ? color(i % 4) : "#ddd"))
      .attr("stroke", "white")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => d.r)
      .style("cursor", "pointer")
      .on("click", (_, d: HierarchyCircularNode<TTypeGraphNodeDTO>) => {
        if (d.data.id) navigateToObject({ objectType: d.data.objectType, id: d.data.id });
      })
      .on("mouseover", function () {
        select(this).attr("stroke", "yellow").attr("stroke-width", 2);
      })
      .on("mouseout", function () {
        select(this).attr("stroke", "white").attr("stroke-width", 1);
      });

    // Add labels
    svgGroup
      .selectAll("text")
      .data(root.descendants().filter((d) => d.depth === 1))
      .enter()
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "black")
      .text((d) => d.data?.name);
  }, [data, searchKeyword, navigate]);

  return (
    <div className="packGraphDashboard">
      <div className="overlayPanel group">
        <div ref={containerRef} className="packGraphContainer p-4" />
        <div className="absolute inset-0 grid place-items-center rounded-sm bg-black bg-opacity-0 transition-all duration-300 hover:bg-opacity-50">
          <div className="hidden text-center group-hover:block">
            <FindestButton
              extraClassName={
                "rounded bg-white px-8 py-2 text-black transition hover:bg-blue-700 hover:text-white"
              }
              onClick={() => navigate("/dataview")}
            >
              SEE PAGE TYPE BREAKDOWN
            </FindestButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackGraphView;

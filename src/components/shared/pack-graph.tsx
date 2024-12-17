import { ObjectTypeEnum, TTypeGraphNodeDTO } from "@/types/types";
import { hierarchy, HierarchyCircularNode, pack, select } from "d3";

import { FC, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

type TTypeGraphViewProps = {
  data?: TTypeGraphNodeDTO[];
  searchKeyword?: string;
};

export const PackGraphView: FC<TTypeGraphViewProps> = ({ data, searchKeyword }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Function to handle navigation
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

    // Filtered keywrod search
    const filteredData = data.map((node) => ({
      ...node,
      children: node.children?.filter((child) =>
        searchKeyword ? child.name.toLowerCase().includes(searchKeyword.toLowerCase()) : true,
      ),
    }));

    // Container dimensions
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // Create hierarchical data with D3
    const root = pack<TTypeGraphNodeDTO>().size([width, height]).padding(8)(
      // @ts-ignore Expelliarmus
      hierarchy({ name: "root", children: filteredData }).sum((d) => d.size || 1),
    );

    // Create SVG with dynamic viewBox
    const svg = select(container)
      .append("svg")
      .style("width", "80%")
      .style("height", "80%")
      .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
      .style("display", "block");

    // Draw circles
    svg
      .selectAll("circle")
      .data(root.descendants())
      .enter()
      .append("circle")
      .attr("fill", (d) => (d.children ? "#0099cc" : "#ddd"))
      .attr("stroke", "white")
      .attr("cx", (d) => d.x - width / 2)
      .attr("cy", (d) => d.y - height / 2)
      .attr("r", (d) => d.r)
      .style("cursor", "pointer")
      .on("click", (_, d: HierarchyCircularNode<TTypeGraphNodeDTO>) => {
        if (d.data.id) navigateToObject({ objectType: d.data.objectType, id: d.data.id });
      });

    // Add labels
    svg
      .selectAll("text")
      .data(root.descendants().filter((d) => d.depth === 1)) // Top-level nodes, although possibly causing funk
      .enter()
      .append("text")
      .attr("x", (d) => d.x - width / 2)
      .attr("y", (d) => d.y - height / 2)
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
          {/* Will do for the moment */}
          <div className="hidden text-center group-hover:block">
            <button
              className="rounded bg-white px-8 py-2 text-slate-600 transition hover:bg-blue-700 hover:text-white"
              onClick={() => navigate("/library/documents")}
            >
              VIEW PAGE TYPE DATA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackGraphView;

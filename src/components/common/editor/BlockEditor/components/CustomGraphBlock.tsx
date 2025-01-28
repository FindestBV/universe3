// import { BollingerBandsChart } from "@/components/common/utilities/bollinger-chart";
import { RadialStackedBarChart } from "@/components/common/utilities/radial-stacked-chart";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export default () => {
  const mockData = [
    { state: "California", age: "0-10", population: 5000000 },
    { state: "California", age: "11-20", population: 3000000 },
    { state: "Texas", age: "0-10", population: 4000000 },
    { state: "Texas", age: "11-20", population: 2000000 },
    { state: "Florida", age: "0-10", population: 3500000 },
    { state: "Florida", age: "11-20", population: 1500000 },
  ];

  return (
    <NodeViewWrapper className="custom-graph-component">
      {/* Editable content */}
      <NodeViewContent className="content is-editable" />

      {/* D3 chart rendered independently */}
      <div className="chart-container relative w-full overflow-y-scroll p-4">
        <RadialStackedBarChart data={mockData} />
      </div>
    </NodeViewWrapper>
  );
};

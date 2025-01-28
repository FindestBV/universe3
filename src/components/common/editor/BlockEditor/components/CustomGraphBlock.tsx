import { BollingerBandsChart } from "@/components/common/utilities/bollinger-chart";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export default () => {
  const sampleData = [
    { Date: new Date(2023, 0, 1), Close: 150 },
    { Date: new Date(2023, 0, 2), Close: 155 },
    { Date: new Date(2023, 0, 3), Close: 160 },
    { Date: new Date(2023, 0, 4), Close: 158 },
    { Date: new Date(2023, 0, 5), Close: 162 },
    { Date: new Date(2023, 0, 6), Close: 159 },
    { Date: new Date(2023, 0, 7), Close: 165 },
  ];

  return (
    <NodeViewWrapper className="custom-graph-component">
      {/* Editable content */}
      <NodeViewContent className="content is-editable" />

      {/* D3 chart rendered independently */}
      <div className="chart-container max-w-full">
        <BollingerBandsChart data={sampleData} />
      </div>
    </NodeViewWrapper>
  );
};

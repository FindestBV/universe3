import { Node } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

import { useEffect } from "react";

export const MaturityRadarComponent = ({ node }) => {
  useEffect(() => {
    console.log("block mounted");
  }, []);

  return (
    <NodeViewWrapper className="maturity-radar-component max-width-full">
      {/* Editable content */}
      <NodeViewContent className="content is-editable" />

      <div className="martity-radar-container relative w-auto max-w-full overflow-y-scroll">
        <h3>Maturity Radar v2 initial</h3>
        <pre>{JSON.stringify(node.attrs.settings, null, 2)}</pre>
      </div>
    </NodeViewWrapper>
  );
};

export default MaturityRadarComponent;

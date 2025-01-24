import { GenericTestUnit } from "@/components/common/utilities/generic-test-unit";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export default () => {
  return (
    <NodeViewWrapper className="custom-block-component">
      <label contentEditable={false}>CustomBlock</label>
      {/* Editable content including GenericTestUnit */}
      <NodeViewContent className="content is-editable">
        <GenericTestUnit />
      </NodeViewContent>
    </NodeViewWrapper>
  );
};

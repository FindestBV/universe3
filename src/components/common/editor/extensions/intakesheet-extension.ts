import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import IntakeSheetComponent from "../Pages/BlockEditor/components/IntakeSheetComponent";

export default Node.create({
  name: "intakeSheet",

  group: "block",

  content: "inline*",

  addAttributes() {
    return {
      confirmed: { default: false },
      confirmedBy: { default: "" },
      date: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "intake-sheet-component",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["intake-sheet-component", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(IntakeSheetComponent);
  },
});

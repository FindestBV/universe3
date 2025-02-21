import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import CustomGraphBlock from "../Pages/BlockEditor/components/CustomGraphBlock";

export default Node.create({
  name: "customGraphBlock",

  group: "block",

  content: "inline*",

  parseHTML() {
    return [
      {
        tag: "custom-graph-block-component",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["custom-graph-block-component", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomGraphBlock);
  },
});

import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import CustomBlock from "../BlockEditor/components/CustomBlock";

export default Node.create({
  name: "customBlock",

  group: "block",

  content: "inline*",

  parseHTML() {
    return [
      {
        tag: "custom-block-component",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["custom-block-component", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomBlock);
  },
});

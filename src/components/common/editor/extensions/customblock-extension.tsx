import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import CustomBlock from "../Pages/BlockEditor/components/CustomBlock";

export default Node.create({
  name: "customBlock",
  group: "block",
  content: "inline*",

  addAttributes() {
    return {
      id: { default: null },
      theme: { default: "light" }, // Example setting
      dataUrl: { default: "" }, // API URL for fetching external data
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='custom-visualization']",
        getAttrs: (dom) => ({
          id: dom.getAttribute("id"),
          theme: dom.getAttribute("data-theme"),
          dataUrl: dom.getAttribute("data-url") || "",
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-type": "custom-visualization" }, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer((nodeProps) => <CustomBlock {...nodeProps} />);
  },
});

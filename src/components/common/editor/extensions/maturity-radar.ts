import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import MaturityRadarComponent from "../BlockEditor/components/MaturityRadarComponent";

export const MaturityRadar = Node.create({
  name: "maturityRadar",
  group: "block",
  content: "text*",
  atom: true,

  addAttributes() {
    return {
      settings: {
        default: { labels: ["Leadership", "Processes", "Innovation"], data: [3, 4, 2] },
      },
    };
  },

  parseHTML() {
    return [{ tag: "maturity-radar" }];
  },

  renderHTML({ node }) {
    return ["maturity-radar", { "data-settings": JSON.stringify(node.attrs.settings) }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MaturityRadarComponent);
  },

  addCommands() {
    return {
      openMaturityRadarDialog:
        (node) =>
        ({ commands }) => {
          window.dispatchEvent(
            new CustomEvent("openMaturityRadarDialog", {
              detail: { node, settings: node.attrs.settings },
            }),
          );
        },
    };
  },
});

// https://tiptap.dev/docs/examples/experiments/figure
// node_modules
import { mergeAttributes, Node, nodeInputRule } from "@tiptap/core";
import { Content, JSONContent } from "@tiptap/react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customImage: {
      setCustomImage: (options: { src: string; id: string }, content: Content) => ReturnType;
    };
  }
}

export const inputRegex = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

export const CustomImage = Node.create({
  name: "customImage",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: "block",

  content: "inline*",

  draggable: true,

  isolating: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.querySelector("img")?.getAttribute("src"),
      },
      id: {
        default: "",
      },
    };
  },

  addCommands() {
    return {
      setCustomImage:
        (options, content) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
            content: content as JSONContent[],
          });
        },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure",
        contentElement: "figcaption",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      { class: "custom-image" },
      [
        "img",
        mergeAttributes(HTMLAttributes, {
          draggable: false,
          contenteditable: false,
          class: "custom-image-img",
        }),
      ],
      [
        "figcaption",
        {
          draggable: false,
          class: "custom-image-caption",
        },
        0,
      ],
    ];
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [src] = match;

          return { src };
        },
      }),
    ];
  },
});

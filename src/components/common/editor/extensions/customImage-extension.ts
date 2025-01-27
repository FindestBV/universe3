import { mergeAttributes, Node, nodeInputRule } from "@tiptap/core";

export const inputRegex = /!\[(.+?)\]\((\S+)\)/;

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
        parseHTML: (element) => element.querySelector("img")?.getAttribute("src") || null,
      },
      id: {
        default: "",
      },
      alt: {
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
            content: content || [],
          });
        },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure",
        getAttrs: (element) => {
          const img = element.querySelector("img");
          return img ? { src: img.getAttribute("src") } : false;
        },
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
        { class: "custom-image-caption" },
        0, // Placeholder for inline content
      ],
    ];
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, alt, src] = match;
          return { src, alt };
        },
      }),
    ];
  },
});

export default CustomImage;

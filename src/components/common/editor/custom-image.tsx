import { Node } from "@tiptap/core";

export const CustomImage = Node.create({
  name: "customImage",
  group: "block",
  inline: false,
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: "",
      },
      title: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "img[src]",
        getAttrs: (dom: HTMLElement) => ({
          src: dom.getAttribute("src"),
          alt: dom.getAttribute("alt"),
          title: dom.getAttribute("title"),
        }),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["img", HTMLAttributes];
  },
});

export default CustomImage;

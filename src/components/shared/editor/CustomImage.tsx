import { mergeAttributes, Node } from "@tiptap/core";

const CustomImage = Node.create({
  name: "customImage",
  group: "block",
  inline: false,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      id: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: "img[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },
});

export default CustomImage;

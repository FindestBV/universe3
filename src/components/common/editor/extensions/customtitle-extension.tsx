import { Node } from "@tiptap/core";

const Title = Node.create({
  name: "title",
  content: "text*", // Allows inline text
  group: "block",
  defining: true,
  parseHTML() {
    return [
      {
        tag: "h1",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["h1", HTMLAttributes, 0]; // Render as <h1>
  },
  addAttributes() {
    return {
      id: {
        default: null,
      },
    };
  },
});

export default Title;

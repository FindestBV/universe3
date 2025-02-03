// node_modules
import Blockquote from "@tiptap/extension-blockquote";

export const CustomBlockquote = Blockquote.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: "",
      },
    };
  },
});

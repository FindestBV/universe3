// node_modules
import { Extension } from "@tiptap/core";

// Types

export const ObjectEditedExtension = Extension.create({
  name: "objectEditedExtension",
  addStorage() {
    return {
      objectEdited: null as null,
    };
  },
});

// node_modules
import { isContentEmpty } from "@/lib/utils";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Node } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { Extension } from "@tiptap/react";

export const PlaceholderExtension = Extension.create({
  name: "PlaceholderExtension",
  priority: 99,
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("placeholderExtension"),
        props: {
          decorations: ({ doc }) => {
            const decorations: Decoration[] = [];

            const isEditorEmpty = isContentEmpty(doc.toJSON());

            if (
              doc.childCount < 2 &&
              isEditorEmpty &&
              doc.firstChild &&
              doc.firstChild.type.name === Paragraph.name
            ) {
              const decorate = (node: Node, pos: number) => {
                decorations.push(
                  Decoration.node(pos, pos + node.nodeSize, {
                    class: "is-editor-empty is-empty",
                    "data-placeholder":
                      "Welcome to your page! Here, you have the freedom to craft and arrange content by formatting text, adding links, images, files, and tables, and even utilizing IGORᴬᴵ. The right sidebar provides options to include references, highlights, and images from connected documents. Have fun creating!",
                  }),
                );
              };

              doc.descendants(decorate);
            }

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

export default PlaceholderExtension;

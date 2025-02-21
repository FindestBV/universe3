// node_modules
import { Link } from "@tiptap/extension-link";
import { Mark } from "@tiptap/pm/model";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
// Constants
import { EventConstants } from "Constants";
// Enums
import { LogFeatureNameEnum, ObjectTypeEnum } from "Enums";
// Helpers
import { LogHelperSingleton, ObjectTypeHelperSingleton } from "Helpers";
import { Plugin, PluginKey } from "prosemirror-state";

import { NavigateFunction } from "react-router-dom";

export const GetCustomLink = (navigate?: NavigateFunction, preventDefault?: boolean) => {
  return Link.extend({
    inclusive: false,
    addAttributes() {
      return {
        ...this.parent?.(),
        rel: {
          default: "noopener noreferrer",
          renderHTML: (attributes) => {
            let rel: string | null = "noopener noreferrer";

            switch (attributes.type) {
              case ObjectTypeEnum.Entity:
              case ObjectTypeEnum.Study:
                rel = null;
                break;
              default:
                break;
            }

            return { rel };
          },
        },
        target: {
          default: "_blank",
          renderHTML: (attributes) => {
            let target: string | null = "_blank";

            switch (attributes.type) {
              case ObjectTypeEnum.Entity:
              case ObjectTypeEnum.Study:
                target = null;
                break;
              default:
                break;
            }

            return { target };
          },
        },
        id: {
          default: null,
        },
        type: {
          default: null,
        },
        class: {
          default: null,
          renderHTML: (attributes) => {
            let className = null;

            switch (attributes.type) {
              case ObjectTypeEnum.Entity:
                className = "entity-reference-link";
                break;
              case ObjectTypeEnum.Study:
                className = "study-reference-link";
                break;
              case ObjectTypeEnum.File:
                className = "file-reference-link";
                break;
              default:
                break;
            }

            return { class: className };
          },
        },
      };
    },
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey("onCustomLinkClick"),
          props: {
            handleDOMEvents: {
              click: (view, event) => {
                const targetElement = event.target as HTMLElement;

                if (
                  (targetElement.tagName === "A" || targetElement.tagName === "SPAN") &&
                  view.dom.contains(targetElement)
                ) {
                  const url: string = targetElement.getAttribute("href") ?? "";
                  const id: string = targetElement.getAttribute("id") ?? "";
                  const type: ObjectTypeEnum = parseInt(
                    targetElement.getAttribute("type") ?? "",
                    10,
                  );

                  if (
                    navigate &&
                    id &&
                    [ObjectTypeEnum.Entity, ObjectTypeEnum.Study].includes(type)
                  ) {
                    LogHelperSingleton.log(`${LogFeatureNameEnum.Reporting}-NavigateToObject`);

                    ObjectTypeHelperSingleton.navigateBasedOnObjectType(type, id, navigate);
                    return;
                  }

                  if (!url) return;

                  const click = new CustomEvent(EventConstants.INLINE_REFERENCE_EVENT, {
                    detail: { url: url, id: id },
                  });
                  window.dispatchEvent(click);

                  if (preventDefault) {
                    event.preventDefault();
                  } else {
                    LogHelperSingleton.log(`${LogFeatureNameEnum.Reporting}-OpenLink`);
                  }

                  event.stopPropagation();
                  event.stopImmediatePropagation();
                }
              },
            },
          },
        }),
        new Plugin({
          key: new PluginKey("customLinkDecoration"),
          props: {
            decorations: ({ doc, selection }) => {
              const decorations: Decoration[] = [];
              const { from, to } = selection;
              doc.nodesBetween(from, to, (node, pos) => {
                if (node.isText && node.marks.length) {
                  const mark = node.marks.find(
                    (currMark: Mark) => currMark.type.name === this.name,
                  );
                  if (
                    mark?.attrs.type &&
                    [ObjectTypeEnum.Entity, ObjectTypeEnum.Study, ObjectTypeEnum.File].includes(
                      parseInt(mark.attrs.type, 10),
                    )
                  ) {
                    const decoration = Decoration.inline(pos, pos + node.nodeSize, {
                      class: "has-focus",
                      id: mark.attrs.id,
                      type: mark.attrs.type,
                      href: mark.attrs.href,
                    });
                    decorations.push(decoration);
                  }
                }
              });
              return DecorationSet.create(doc, decorations);
            },
          },
        }),
      ];
    },
  });
};

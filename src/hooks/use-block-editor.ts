import type { EditorUser } from "@/components/common/editor/BlockEditor/types";
import CustomBlock from "@/components/common/editor/extensions/customblock-extension";
import CustomGraphBlock from "@/components/common/editor/extensions/customgraphblock-extension";
import CustomImage from "@/components/common/editor/extensions/customImage";
import Title from "@/components/common/editor/extensions/customtitle-extension";
import IntakeSheetComponent from "@/components/common/editor/extensions/intakesheet-extension";
import { ExtensionKit } from "@/extensions/extension-kit";
import { initialContent } from "@/lib/data/initialContent";
import { TiptapCollabProvider, WebSocketStatus } from "@hocuspocus/provider";
import type { Editor } from "@tiptap/core";
import { Mark } from "@tiptap/core";
import Blockquote from "@tiptap/extension-blockquote";
import { useEditor, useEditorState } from "@tiptap/react";
import type { Doc as YDoc } from "yjs";

import { useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

export const Rating = Mark.create({
  name: "rating",
  addAttributes() {
    return {
      rating: { default: 0 },
      sourceId: { default: null },
      targetId: { default: null },
      ratersCount: { default: 0 },
      isRatingNeeded: { default: false },
    };
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", { class: "rating", ...HTMLAttributes }, "⭐"];
  },
});

export const useBlockEditor = ({
  // aiToken,
  ydoc,
  provider,
  // userId,
  // type,
  content,
  title,
  // connectedDocs,
  // connectedInbox,
  // connectedObjects,
  // connectedQueries,
  // connectedComments,
  // extensions,
}: {
  aiToken?: string;
  ydoc: YDoc | null;
  provider?: TiptapCollabProvider | null | undefined;
  userId?: string;
  userName?: string;
  type?: string;
  content?: string;
  title?: string;
  connectedDocs?: string;
  connectedInbox?: string;
  connectedObjects?: string;
  connectedQueries?: string;
  connectedComments?: string;
  extensions?: string;
}) => {
  const [collabState, setCollabState] = useState<WebSocketStatus>(
    provider ? WebSocketStatus.Connecting : WebSocketStatus.Disconnected,
  );

  const parsedContent = useMemo(() => {
    try {
      const parsed = typeof content === "string" ? JSON.parse(content) : content;
      console.log("blockeditor, title", title);

      // Ensure parsed content exists and is an array
      const parsedContentArray = Array.isArray(parsed?.content) ? parsed.content : [];

      // Define the title node (only if title exists)
      const titleNode = title
        ? {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: title }],
          }
        : null;

      // Check if the first node is already a heading of level 1
      const firstNode = parsedContentArray[0];
      if (firstNode?.type === "heading" && firstNode?.attrs?.level === 1) {
        // If a title exists, update its text
        if (title) {
          firstNode.content = [{ type: "text", text: title }];
        } else {
          // If title is removed, remove the existing title node
          return { ...parsed, content: parsedContentArray.slice(1) };
        }
        return { ...parsed, content: parsedContentArray };
      }

      // If no title exists but title is provided, prepend the title node
      return {
        ...parsed,
        content: titleNode
          ? [titleNode, ...parsedContentArray]
          : [titleNode, ...parsedContentArray],
      };
    } catch (error) {
      console.error("Error parsing content:", error);

      // If content is missing or invalid, return default structure
      return {
        type: "doc",
        content: [
          ...(title
            ? [
                {
                  type: "heading",
                  attrs: { level: 1 },
                  content: [{ type: "text", text: title }],
                },
              ]
            : []),
          {
            type: "paragraph",
            content: [{ type: "text", text: "Start writing here..." }],
          },
        ],
      };
    }
  }, [content, title]);

  const editor = useEditor(
    {
      immediatelyRender: true,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      content: parsedContent,
      onCreate: (ctx) => {
        if (provider && !provider.isSynced) {
          provider.on("synced", () => {
            setTimeout(() => {
              if (ctx.editor.isEmpty) {
                ctx.editor.commands.setContent(initialContent);
              }
            }, 0);
          });
        } else if (ctx.editor.isEmpty) {
          ctx.editor.commands.setContent(initialContent);
          ctx.editor.commands.focus("start", { scrollIntoView: true });
        }
      },
      extensions: [
        ...ExtensionKit({
          provider,
        }),
        Title,
        Blockquote,
        CustomBlock,
        CustomGraphBlock,
        IntakeSheetComponent,
        CustomImage,
        Rating,
      ],
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          class: "min-h-full",
        },
      },
    },
    [ydoc, provider],
  );
  const users = useEditorState({
    editor,
    selector: (ctx): (EditorUser & { initials: string })[] => {
      if (!ctx.editor?.storage.collaborationCursor?.users) {
        return [];
      }

      return ctx.editor.storage.collaborationCursor.users.map((user: EditorUser) => {
        const names = user.name?.split(" ");
        const firstName = names?.[0];
        const lastName = names?.[names.length - 1];
        const initials = `${firstName?.[0] || "?"}${lastName?.[0] || "?"}`;

        return { ...user, initials: initials.length ? initials : "?" };
      });
    },
  });

  useEffect(() => {
    provider?.on("status", (event: { status: WebSocketStatus }) => {
      setCollabState(event.status);
    });
  }, [provider]);

  window.editor = editor;

  return { editor, users, collabState };
};

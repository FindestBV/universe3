import type { EditorUser } from "@/components/common/editor/BlockEditor/types";
import CustomBlock from "@/components/common/editor/extensions/customblock-extension";
import CustomGraphBlock from "@/components/common/editor/extensions/customgraphblock-extension";
import CustomImage from "@/components/common/editor/extensions/customImage";
import Title from "@/components/common/editor/extensions/customtitle-extension";
import IntakeSheetComponent from "@/components/common/editor/extensions/intakesheet-extension";
import { AiImage, AiWriter } from "@/extensions";
import { Ai } from "@/extensions/Ai";
import { ExtensionKit } from "@/extensions/extension-kit";
import { initialContent } from "@/lib/data/initialContent";
import { TiptapCollabProvider, WebSocketStatus } from "@hocuspocus/provider";
import type { AnyExtension, Editor } from "@tiptap/core";
import Blockquote from "@tiptap/extension-blockquote";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { useEditor, useEditorState } from "@tiptap/react";
import type { Doc as YDoc } from "yjs";

import { useEffect, useMemo, useState } from "react";

import { userColors, userNames } from "../lib/constants";
import { randomElement } from "../lib/utils";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

export const useBlockEditor = ({
  aiToken,
  ydoc,
  provider,
  userId,
  userName = "Maxi",
  type,
  content,
  title,
  connectedDocs,
  connectedInbox,
  connectedObjects,
  connectedQueries,
  connectedComments,
  extensions,
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
  // console.log("Unparsed Content:", type);
  const parsedContent = useMemo(() => {
    try {
      const parsed = typeof content === "string" ? JSON.parse(content) : content;
      console.log("blockeditor, title", title);
      // Define the title node
      const titleNode = {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: title || "Enter a title..." }],
      };

      // Check if the first node is already a heading of level 1 (title)
      if (parsed?.content?.[0]?.type === "heading" && parsed.content[0]?.attrs?.level === 1) {
        // If a title exists, update its text
        parsed.content[0].content = [{ type: "text", text: title || "Untitled Document" }];
        return parsed;
      }

      // If no title exists, add the title node at the beginning of the content
      return {
        ...parsed,
        content: [titleNode, ...(parsed?.content || [])],
      };
    } catch (error) {
      console.error("Error parsing content:", error);

      // Fallback content structure with title
      return {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: title || "Untitled Document" }],
          },
          ...(content || []),
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
        provider && ydoc
          ? Collaboration.configure({
              document: ydoc,
            })
          : undefined,
        provider
          ? CollaborationCursor.configure({
              provider,
              user: {
                name: randomElement(userNames),
                color: randomElement(userColors),
              },
            })
          : undefined,
        aiToken
          ? AiWriter.configure({
              authorId: userId,
              authorName: userName,
            })
          : undefined,
        aiToken
          ? AiImage.configure({
              authorId: userId,
              authorName: userName,
            })
          : undefined,
        aiToken ? Ai.configure({ token: aiToken }) : undefined,
      ].filter((e): e is AnyExtension => e !== undefined),
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

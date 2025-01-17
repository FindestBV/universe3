import type { EditorUser } from "@/components/common/editor/BlockEditor/types";
import { AiImage, AiWriter } from "@/extensions";
import { Ai } from "@/extensions/Ai";
import { ExtensionKit } from "@/extensions/extension-kit";
import { TiptapCollabProvider, WebSocketStatus } from "@hocuspocus/provider";
import type { AnyExtension, Editor } from "@tiptap/core";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { useEditor, useEditorState } from "@tiptap/react";
import type { Doc as YDoc } from "yjs";

import { useEffect, useState } from "react";

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
}) => {
  const [collabState, setCollabState] = useState<WebSocketStatus>(
    provider ? WebSocketStatus.Connecting : WebSocketStatus.Disconnected,
  );

  const parsedContent = typeof content === "string" ? JSON.parse(content) : content;
  console.log("Parsed Content:", JSON.stringify(parsedContent, null, 2));

  const editor = useEditor(
    {
      immediatelyRender: true,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      content: parsedContent ||
        defaultContent || {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Welcome to your page! Here, you have the freedom to craft and arrange content by formatting text addinglinks,\n images, files and tables and even utilizing IGOR<sup>AI</sup>. The right sidebar provides otions to include references, \n highlights and images from connected documents. \n Have fun creating!",
                },
              ],
            },
          ],
        },
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

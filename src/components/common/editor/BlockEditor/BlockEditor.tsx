import { toggleSidebar } from "@/api/utilities/sidebarSlice";
import SimilarDocumentModal from "@/components/common/dialogs/similar-document-modal";
import ReferencesSidebar from "@/components/common/sidebar/references-sidebar";
import ImageBlockMenu from "@/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/extensions/Table/menus";
import { useBlockEditor } from "@/hooks/useBlockEditor";
import { useSidebar } from "@/hooks/useSidebar";
import { TiptapCollabProvider } from "@hocuspocus/provider";
import { Mark } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Text from "@tiptap/extension-text";
import { EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Key } from "history";
import { Download } from "lucide-react";
import * as Y from "yjs";

import React, { useRef, useState } from "react";

import Comments from "../../layout/comments";
import CustomImage from "../custom-image";
import { LinkMenu } from "../menus";
import { ContentItemMenu } from "../menus/ContentItemMenu";
import { TextMenu } from "../menus/TextMenu";
import PlaceholderExtension from "../placeholder-extension";
import { Sidebar } from "../Sidebar";
import { Button } from "../ui/Button";
import { EditorHeader } from "./components/EditorHeader";

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

export const BlockEditor = ({
  aiToken,
  ydoc,
  provider,
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
  ydoc: Y.Doc | null;
  provider?: TiptapCollabProvider | null | undefined;
  type?: string;
  content?: string;
  title?: string;
  connectedDocs?: string;
  connectedInbox?: string;
  connectedObjects?: string;
  connectedQueries?: string;
  connectedComments?: string;
}) => {
  const menuContainerRef = useRef(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const parsedContent = typeof content === "string" ? JSON.parse(content) : content;
  console.log("Parsed Content:", JSON.stringify(parsedContent, null, 2));

  const leftSidebar = useSidebar();
  // const { editor, users, collabState } = useBlockEditor({ aiToken, ydoc, provider })

  const { editor, users, collabState } = useBlockEditor({
    aiToken,
    ydoc,
    provider,
    extensions: [
      Link.configure({
        openOnClick: true,
      }),
      Document,
      Paragraph.configure({
        HTMLAttributes: {
          class: "editor_paragraph",
        },
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Text,
      Image,
      CustomImage,
      Rating,
      PlaceholderExtension,
      StarterKit,
    ],
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

    onUpdate({ editor }) {
      const value = editor.getHTML();
      console.log("Editor HTML:", value); // Check rendered HTML
      console.log("Editor JSON:", editor.getJSON()); // Check internal JSON structure
      onChange(value);
    },
  });

  console.log("parsed content", parsedContent);

  if (!editor) {
    return <p>Loading editor...</p>;
  }

  return (
    <div className="flex h-screen pb-8" ref={menuContainerRef}>
      <div className="relative flex h-full flex-1 flex-col overflow-hidden">
        <EditorHeader
          editor={editor}
          collabState={collabState}
          users={users}
          isSidebarOpen={leftSidebar.isOpen}
          toggleSidebar={leftSidebar.toggle}
        />
      </div>
      <div className="flex flex-row">
        <div className="relative flex h-screen flex-row gap-10">
          <div className={`${isSidebarCollapsed ? "w-full" : "w-3/4"}`}>
            <div className="flex flex-col justify-between">
              <EditorContent editor={editor} className="h-screen flex-1 p-16" />
              <ContentItemMenu editor={editor} />
              <LinkMenu editor={editor} appendTo={menuContainerRef} />
              <TextMenu editor={editor} />
              <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
              <TableRowMenu editor={editor} appendTo={menuContainerRef} />
              <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
              <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />

              <div className="editorContentContainer" id="linkedDocuments">
                <h3 className="itemTitle flex items-center gap-4">
                  Linked documents <Download size={16} />
                </h3>

                {connectedObjects?.documents && connectedObjects.documents.length > 0
                  ? connectedObjects.documents.map(
                      (doc: { title: Key | null | undefined; id: string }) => (
                        <div key={doc.title}>
                          <SimilarDocumentModal
                            title={doc.title}
                            id={doc.id}
                            type="linkedObjects"
                            isOpenAccess={doc.isOpenAccess}
                          />
                        </div>
                      ),
                    )
                  : "no connected objects"}
              </div>

              <div className="editorContentContainer" id="connectedQueries">
                <h3 className="itemTitle">Connected Queries</h3>
                <p className="iconText">Connections:</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {connectedQueries &&
                    (connectedQueries[0]?.connectedObjects &&
                    connectedQueries[0].connectedObjects.length > 0 ? (
                      connectedQueries[0].connectedObjects.map(
                        (obj: {
                          id: Key | null | undefined;
                          name: string;
                          mainContents: unknown;
                          searchInformation: unknown;
                        }) => (
                          <SimilarDocumentModal
                            key={obj.id}
                            id={obj.id}
                            title={obj.name}
                            mainContents={obj.mainContents}
                            searchInformation={obj.searchInformation}
                            type="entity"
                          />
                        ),
                      )
                    ) : (
                      <div className="flex flex-row-reverse items-center gap-4">
                        <Button variant="ghost">Connect a query</Button>
                        <p className="text-gray-500">No connected objects</p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="editorContentContainer" id="connectedComments">
                <Comments connectedComments={connectedComments} />
              </div>
            </div>
          </div>
          <div
            className={`referenceSidebar ${isSidebarCollapsed ? "opacity-1" : "w-1/4 opacity-100"}`}
          >
            <ReferencesSidebar
              onToggleSidebar={toggleSidebar}
              isCollapsed={isSidebarCollapsed}
              connectedDocs={connectedDocs}
              connectedObjects={connectedObjects}
              connectedInbox={connectedInbox}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockEditor;

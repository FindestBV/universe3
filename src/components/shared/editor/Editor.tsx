/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
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
import { BubbleMenu, EditorContent, FloatingMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Download } from "lucide-react";

import { Key, useState } from "react";

// import GenericCard from "../cards/generic-card";
import Comments from "../layout/comments";
import SimilarDocumentModal from "../modals/similar-document-modal";
import ReferencesSidebar from "../sidebar/references-sidebar";
import CustomImage from "./custom-image";
import EditorToolbar from "./editor-toolbar";

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

export const Editor = ({
  type,
  content,
  title,
  connectedDocs,
  connectedInbox,
  connectedObjects,
  connectedQueries,
  connectedComments,
}: any) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const parsedContent = typeof content === "string" ? JSON.parse(content) : content;
  console.log("Parsed Content:", JSON.stringify(parsedContent, null, 2));

  const defaultContent = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "This is the default paragraph text." }],
      },
    ],
  };

  const editor = useEditor({
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
      StarterKit,
    ],
    content: parsedContent ||
      defaultContent || {
        type: "doc",
        content: [{ type: "paragraph", content: [{ type: "text", text: "Start writing..." }] }],
      },
    onUpdate({ editor }) {
      const value = editor.getHTML();
      console.log("Editor HTML:", value); // Check rendered HTML
      console.log("Editor JSON:", editor.getJSON()); // Check internal JSON structure
      onChange(value);
    },
  });

  if (!editor) {
    return <p>Loading editor...</p>;
  }

  return (
    <>
      <EditorToolbar editor={editor} />
      <div className="flex">
        {/* Main Content */}
        <div className={`editorMainContent ${isSidebarCollapsed ? "w-full" : "w-3/4"}`}>
          <div className="editorContentContainer my-8 flex flex-col">
            <div className="bg-white">
              <div className="mx-auto text-gray-700">
                <div className="flex flex-row items-center gap-4">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="dice-d6"
                    className="svg-inline--fa fa-dice-d6 objectItem_objectIcon__xwkQs"
                    width="24px"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="currentColor"
                      d="M201 10.3c14.3-7.8 31.6-7.8 46 0L422.3 106c5.1 2.8 8.3 8.2 8.3 14s-3.2 11.2-8.3 14L231.7 238c-4.8 2.6-10.5 2.6-15.3 0L25.7 134c-5.1-2.8-8.3-8.2-8.3-14s3.2-11.2 8.3-14L201 10.3zM23.7 170l176 96c5.1 2.8 8.3 8.2 8.3 14l0 216c0 5.6-3 10.9-7.8 13.8s-10.9 3-15.8 .3L25 423.1C9.6 414.7 0 398.6 0 381L0 184c0-5.6 3-10.9 7.8-13.8s10.9-3 15.8-.3zm400.7 0c5-2.7 11-2.6 15.8 .3s7.8 8.1 7.8 13.8l0 197c0 17.6-9.6 33.7-25 42.1L263.7 510c-5 2.7-11 2.6-15.8-.3s-7.8-8.1-7.8-13.8l0-216c0-5.9 3.2-11.2 8.3-14l176-96z"
                    ></path>
                  </svg>{" "}
                  {type.toUpperCase()}
                </div>
                <h1 className="my-4 flex-1 text-3xl font-bold text-black">{title || "Document"}</h1>
              </div>

              <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
              <EditorContent editor={editor} />
              <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
            </div>
          </div>

          <div className="editorContentContainer" id="linkedDocuments">
            <h3 className="itemTitle flex items-center gap-4">
              Linked documents <Download size={16} />
            </h3>

            {connectedObjects?.documents && connectedObjects.documents.length > 0
              ? connectedObjects.documents.map(
                  (doc: { title: Key | null | undefined; id: string }) => (
                    <div key={doc.title}>
                      <SimilarDocumentModal title={doc.title} id={doc.id} type="linkedObjects" />
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

        {/* Sidebar */}
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
    </>
  );
};

export default Editor;

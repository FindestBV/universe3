import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { BubbleMenu, EditorContent, FloatingMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { useState } from "react";

import Comments from "../layout/comments";
import ReferencesSidebar from "../sidebar/references-sidebar";
import CustomImage from "./CustomImage";
import EditorToolbar from "./editor-toolbar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Editor = ({ content, title, connectedDocs }: any) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => {
    console.log("triggered in editor");
    setIsSidebarCollapsed((prev) => !prev);
  };

  const parsedContent = typeof content === "string" ? JSON.parse(content) : content;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
      }),
      Image,
      CustomImage,
    ],
    content: parsedContent || {
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: "Start writing..." }] }],
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
        <div
          className={`flex-col transition-all duration-300 ${
            isSidebarCollapsed ? "w-full" : "w-3/4"
          }`}
        >
          <div className="mx-16 my-8 flex flex-col">
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
              ENTITY
            </div>
            <h1 className="my-4 flex-1 text-3xl font-bold text-black">{title || "Document"}</h1>
          </div>

          <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
          <EditorContent editor={editor} />
          <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
          <div className="mx-16">
            <Comments />
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`relative flex flex-col border-l border-gray-200 transition-all duration-300 ${
            isSidebarCollapsed ? "opacity-1" : "w-1/4 opacity-100"
          }`}
        >
          <ReferencesSidebar
            onToggleSidebar={toggleSidebar}
            isCollapsed={isSidebarCollapsed}
            connectedDocs={connectedDocs}
          />
        </div>
      </div>
    </>
  );
};

export default Editor;

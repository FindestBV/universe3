import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { BubbleMenu, EditorContent, FloatingMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { useState } from "react";

import ReferencesSidebar from "../sidebar/references-sidebar";
import CustomImage from "./CustomImage";
import EditorToolbar from "./editor-toolbar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Editor = ({ content, entityTitle, connectedDocs }: any) => {
  console.log("actual content", content);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => {
    console.log("should be toggled");
    setIsSidebarCollapsed(!isSidebarCollapsed);
    console.log(isSidebarCollapsed);
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
    console.error("Editor failed to initialize.");
    return <p>Loading editor...</p>;
  }

  return (
    <>
      <EditorToolbar editor={editor} />
      <h1>{entityTitle}</h1>
      <div className="flex flex-row">
        <div className="tiptap">
          <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
          <EditorContent editor={editor} />
          <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
        </div>

        <ReferencesSidebar
          onToggleSidebar={toggleSidebar}
          isCollapsed={isSidebarCollapsed}
          connectedDocs={connectedDocs}
          connectedInbox={""}
        />
      </div>
    </>
  );
};

export default Editor;

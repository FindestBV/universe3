import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { BubbleMenu, EditorContent, FloatingMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import CustomImage from "./CustomImage";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Tiptap = ({ content }: any) => {
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
    <div className="tiptap">
      <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      <EditorContent editor={editor} />
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
    </div>
  );
};

export default Tiptap;

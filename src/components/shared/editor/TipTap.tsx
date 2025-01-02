// src/Tiptap.tsx
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { BubbleMenu, EditorContent, FloatingMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Tiptap = ({ content }: any) => {
  console.log("for render", typeof content);
  const parsedContent = typeof content === "string" ? JSON.parse(content) : content;
  console.log("parsed", parsedContent.content);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
      }),
      Image,
    ],
    content: parsedContent.content,
  });

  console.log("editor object", editor?.options.content);

  return (
    <div>
      <h3>Raw JSON Content:</h3>
      <pre>{JSON.stringify(parsedContent.content, null, 2)}</pre>
      <FloatingMenu editor={null}>This is the floating menu</FloatingMenu>
      <h3>TTE:</h3>
      <EditorContent editor={editor} />
      <BubbleMenu editor={null}>This is the bubble menu</BubbleMenu>
    </div>
  );
};

export default Tiptap;

// src/Tiptap.tsx
import renderProseMirrorContent from "@/lib/renderProseMirror";
import { BubbleMenu, EditorProvider, FloatingMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// define your extension array
const extensions = [StarterKit];

export const Tiptap = ({ content }) => {
  console.log("raw object passed into TipTap component", content.content);

  console.log("content passed into TipTap component", renderProseMirrorContent(content.content));

  return (
    <EditorProvider extensions={extensions} content={content}>
      <FloatingMenu editor={null}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={null}>This is the bubble menu</BubbleMenu>
    </EditorProvider>
  );
};

export default Tiptap;

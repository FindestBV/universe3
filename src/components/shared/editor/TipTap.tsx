import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import CustomImage from "./CustomImage";

// Custom extension for `customImage`

const Tiptap = ({ content }) => {
  // Debug to verify content format
  console.log("Content passed to TipTap:", content);

  const editor = useEditor({
    extensions: [
      StarterKit, // Includes basic node types like paragraph, heading
      Link.configure({ openOnClick: true }), // For clickable links
      Image, // For basic image nodes
      CustomImage, // Support for `customImage` nodes
    ],
    content, // Pass the JSON content directly
    onCreate: ({ editor }) => {
      console.log("Editor initialized with content:", editor.getJSON());
    },
  });

  if (!editor) return null;

  return (
    <div className="tiptap-editor">
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;

// useSemanticSearchEditor.ts
import { EditorState } from "@/types/ask-igor";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface UseSemanticSearchEditorProps {
  initialContent?: string;
  onUpdate?: (content: string) => void;
  maxLength?: number;
}

export const useSemanticSearchEditor = ({
  initialContent = "",
  onUpdate,
  maxLength = 1000,
}: UseSemanticSearchEditorProps = {}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: true,
        dropcursor: true,
        gapcursor: true,
      }),
      Placeholder.configure({
        placeholder: "Ask me anything about the linked sources...",
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose prose-sm focus:outline-none max-w-none min-h-[120px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getText();
      onUpdate?.(content);
    },
  });

  return {
    editor,
    isReady: !!editor,
    isEmpty: editor?.isEmpty ?? true,
    characterCount: editor?.storage.characterCount.characters() ?? 0,
    maxLength,
  };
};

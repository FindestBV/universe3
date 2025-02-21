// useSemanticSearchEditor.ts
import { EditorEvents } from "@tiptap/core";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export const useSemanticSearchEditor = ({
  onCreate,
  onUpdate,
}: {
  onCreate?: (props: EditorEvents["create"]) => void;
  onUpdate?: (props: EditorEvents["update"]) => void;
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: `
      <div class="raggyEditor">
        <h3>
          Y'all mind if I do some Lollygaggin'?
        </h3>
      </div>

    `,
    onCreate: (props) => onCreate && onCreate(props),
    onUpdate: (props) => onUpdate && onUpdate(props),
  });

  return { editor };
};

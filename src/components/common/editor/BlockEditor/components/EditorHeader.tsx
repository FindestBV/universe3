import { RootState } from "@/store";
import { WebSocketStatus } from "@hocuspocus/provider";
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";

import { useDispatch, useSelector } from "react-redux";

// import { List } from "lucide-react";

// import { Toolbar } from "../../ui/Toolbar";
import { EditorUser } from "../types";
import { EditorInfo } from "./EditorInfo";

export type EditorHeaderProps = {
  editor: Editor;
  collabState: WebSocketStatus;
  users: EditorUser[];
  documentId?: string;
};

export const EditorHeader = ({ editor, collabState, users, documentId }: EditorHeaderProps) => {
  const { characters, words } = useEditorState({
    editor,
    selector: (ctx): { characters: number; words: number } => {
      const { characters, words } = ctx.editor?.storage.characterCount || {
        characters: () => 0,
        words: () => 0,
      };
      return { characters: characters(), words: words() };
    },
  });

  return (
    <div className="editorHeader">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EditorInfo
            characters={characters}
            words={words}
            collabState={collabState}
            users={users}
            id={documentId}
            editor={editor}
          />
        </div>
      </div>
    </div>
  );
};

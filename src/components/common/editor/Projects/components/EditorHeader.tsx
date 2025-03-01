import { WebSocketStatus } from "@hocuspocus/provider";
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { List } from "lucide-react";

import { useSelector } from "react-redux";

import { Toolbar } from "../../ui/Toolbar";
import { EditorUser } from "../types";
import { EditorInfo } from "./EditorInfo";

export type EditorHeaderProps = {
  isSidebarOpen?: boolean;
  toggleLeftSidebar?: () => void;
  editor: Editor;
  collabState: WebSocketStatus;
  users: EditorUser[];
  documentId?: string;
};

export const EditorHeader = ({
  editor,
  collabState,
  users,
  isSidebarOpen,
  toggleLeftSidebar,
  documentId,
}: EditorHeaderProps) => {
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
  const isEditing = useSelector((state: RootState) => state.document.isEditing);

  return (
    <div className="editorHeader">
      <EditorInfo
        characters={characters}
        words={words}
        collabState={collabState}
        users={users}
        id={documentId}
      />
    </div>
  );
};

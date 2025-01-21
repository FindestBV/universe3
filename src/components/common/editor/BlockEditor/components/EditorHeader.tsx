import { WebSocketStatus } from "@hocuspocus/provider";
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { List } from "lucide-react";

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

  return (
    <div className="editorHeader">
      <div className="flex flex-row items-center gap-x-1.5">
        <div className="flex items-center gap-x-1.5">
          <Toolbar.Button
            tooltip={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            onClick={toggleLeftSidebar}
            active={isSidebarOpen}
            className={isSidebarOpen ? "bg-transparent" : ""}
          >
            <List size={24} />
          </Toolbar.Button>
        </div>
      </div>
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

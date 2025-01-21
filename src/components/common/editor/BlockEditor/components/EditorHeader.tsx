import { WebSocketStatus } from "@hocuspocus/provider";
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";

import { Icon } from "../../ui/Icon";
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
    <div className="flex flex-none flex-row items-center border-b border-neutral-200 bg-white py-2 pl-3 pr-3 text-black dark:border-neutral-200 dark:bg-white dark:text-black">
      <div className="flex flex-row items-center gap-x-1.5">
        <div className="flex items-center gap-x-1.5">
          <Toolbar.Button
            tooltip={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            onClick={toggleLeftSidebar}
            active={isSidebarOpen}
            className={isSidebarOpen ? "bg-transparent" : ""}
          >
            <Icon name={isSidebarOpen ? "PanelLeftClose" : "PanelLeft"} />
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

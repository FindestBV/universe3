import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";

import { memo, useCallback } from "react";

import { TableOfContents } from "../../../TableOfContents";

export const TOCSidebar = memo(
  ({ editor, isOpen, onClose }: { editor: Editor; isOpen?: boolean; onClose: () => void }) => {
    const handlePotentialClose = useCallback(() => {
      if (window.innerWidth < 1024) {
        onClose();
      }
    }, [onClose, isOpen, editor]);

    const windowClassName = cn(
      "tocSideBar",
      !isOpen && "border-r-transparent tocSidebar transition-all duration-150 w-0",
      isOpen && "w-64 border-r border-r-neutral-200 dark:border-r-neutral-200",
    );

    return (
      <div className={windowClassName}>
        <div className="h-full w-full overflow-hidden">
          <div className="h-full w-full overflow-auto p-6">
            <TableOfContents onItemClick={handlePotentialClose} editor={editor} />
          </div>
        </div>
      </div>
    );
  },
);

TOCSidebar.displayName = "TableOfContentSidepanel";

export default TOCSidebar;

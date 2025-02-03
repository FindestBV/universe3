import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import { Link, List } from "lucide-react";

import { memo, useCallback } from "react";

import { Toolbar } from "../../../ui/Toolbar";

// import { TableOfContents } from "../../../TableOfContents";

export const TOCSidebar = memo(
  ({
    editor,
    isOpen,
    onClose,
    connectedEntities,
    title,
  }: {
    id?: string;
    editor: Editor;
    isOpen?: boolean;
    onClose?: () => void;
    connectedEntities?: string;
    title?: string;
  }) => {
    const handlePotentialClose = useCallback(() => {
      if (window.innerWidth < 1024) {
        onClose();
      }
    }, [onClose, isOpen, editor]);

    const windowClassName = cn(
      "tocSidebar transition-all duration-300 ease-in-out min-w-0 max-w-0 w-0 opacity-0  border-r border-r-neutral-200 dark:border-r-neutral-200",
      isOpen
        ? "translate-x-0 opacity-100 min-w-64 max-w-80 w-full border-r border-r-neutral-200 dark:border-r-neutral-200"
        : "opacity-0 translate-x-full",
    );

    return (
      <div className={windowClassName}>
        {/* <div className="flex items-center gap-x-1.5">
          <Toolbar.Button
            tooltip={isOpen ? "Close Explorer" : "Open Explorer"}
            onClick={toggleLeftSidebar}
            className={isSidebarOpen ? "bg-transparent" : ""}
          >
            <List size={24} />
          </Toolbar.Button>
        </div> */}
        <div className="h-full w-full overflow-hidden">
          <div className="h-full w-full overflow-auto p-6">
            <h3 className="iconText mb-4 py-1">EXPLORER</h3>
            <h4 className="mb-2 font-bold">{title ? title : null}</h4>
            <ul className="ml-2 flex flex-col-reverse">
              {connectedEntities && connectedEntities.length > 0
                ? connectedEntities.map(
                    (doc: { documentTitle: string }, index: React.Key | null | undefined) => (
                      <li key={index} className="mb-2 flex items-start gap-2">
                        <a href={"#"} className="text-gray-600 hover:text-black">
                          <p className="text-sm">{doc.documentTitle || "Untitled Document"}</p>
                        </a>
                      </li>
                    ),
                  )
                : "No connected entities."}
            </ul>
          </div>
        </div>
      </div>
    );
  },
);

TOCSidebar.displayName = "TableOfContentSidepanel";

export default TOCSidebar;

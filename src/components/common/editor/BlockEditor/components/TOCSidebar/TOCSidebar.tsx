import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import { Link } from "lucide-react";

import { memo, useCallback } from "react";

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
    onClose: () => void;
    connectedEntities;
    title;
  }) => {
    const handlePotentialClose = useCallback(() => {
      if (window.innerWidth < 1024) {
        onClose();
      }
    }, [onClose, isOpen, editor]);

    const windowClassName = cn(
      "tocSidebar transition-all duration-150 min-w-0 max-w-0 w-0 opacity-0",
      !isOpen && "border-r-transparent",
      isOpen &&
        "opacity-1 translate-x-0 min-w-64 max-w-80 w-full border-r border-r-neutral-200 dark:border-r-neutral-200",
    );

    // const windowClassName = cn(
    //   "tocSidebar transition-all duration-150 max-0",
    //   isOpen ? "translate-x-0 w-64 border-r border-r-neutral-200 dark:border-r-neutral-200" : "-translate-x-full w-0",
    // );

    console.log("explorer editor", editor);

    return (
      <div className={windowClassName}>
        <div className="h-full w-full overflow-hidden">
          <div className="h-full w-full overflow-auto p-6">
            <h3 className="iconText mb-4 py-1">EXPLORER</h3>
            <h4 className="mb-2 font-bold">{title ? title : null}</h4>
            <ul className="ml-2 flex flex-col-reverse">
              {connectedEntities && connectedEntities.length > 0
                ? connectedEntities.map(
                    (doc: { title: string }, index: React.Key | null | undefined) => (
                      <li key={index} className="mb-2 flex items-start gap-2">
                        <a href={"#"} className="text-gray-600 hover:text-black">
                          <p className="text-sm">{doc.title || "Untitled Document"}</p>
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

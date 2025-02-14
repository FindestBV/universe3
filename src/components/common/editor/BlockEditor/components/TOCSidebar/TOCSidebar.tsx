import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";

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
      "tocSidebar transition-all duration-300 ease-in-out w-1/4 opacity-0  border-r border-r-neutral-200",
      isOpen
        ? "translate-x-0 opacity-100 w-1/4 w-full border-r border-r-neutral-200"
        : "opacity-0 translate-x-full",
    );

    return (
      <div className={windowClassName}>
        <div className="h-full w-full overflow-hidden">
          <div className="h-full w-full overflow-auto px-6 py-2">
            <h3 className="iconText mb-4 py-1">Project structure</h3>
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

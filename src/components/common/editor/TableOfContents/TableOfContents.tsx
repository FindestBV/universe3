import { cn } from "@/lib/utils";
import { TableOfContentsStorage } from "@tiptap-pro/extension-table-of-contents";
import { Editor as CoreEditor } from "@tiptap/core";

// import { useEditorState } from "@tiptap/react";

import { memo, useEffect, useState } from "react";

export type TableOfContentsProps = {
  editor: CoreEditor | null;
  onItemClick?: () => void;
};

export const TableOfContents = memo(({ editor, onItemClick }: TableOfContentsProps) => {
  const [tocItems, setTocItems] = useState<TableOfContentsStorage["content"]>([]);

  useEffect(() => {
    if (!editor) return;

    try {
      const newContent = (editor.storage.tableOfContents as TableOfContentsStorage)?.content ?? [];

      setTocItems(newContent);
    } catch (error) {
      console.error("Error fetching Table of Contents:", error);
      setTocItems([]); // Prevent undefined state
    }
  }, [editor]); // Only update when the editor instance changes

  return (
    <>
      {tocItems.length > 0 ? (
        <div className="flex flex-col gap-1">
          {tocItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={onItemClick}
              className={cn(
                "block w-full truncate rounded bg-opacity-10 p-1 text-sm font-medium text-neutral-500 transition-all hover:bg-black hover:bg-opacity-5 hover:text-neutral-800 dark:text-neutral-300",
                item.isActive &&
                  "bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
              )}
            >
              {item.itemIndex}. {item.textContent}
            </a>
          ))}
        </div>
      ) : (
        <div className="text-sm text-neutral-500">Start adding headlines to your document …</div>
      )}
    </>
  );
});

TableOfContents.displayName = "TableOfContents";

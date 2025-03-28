import { File, Link2Icon, MessageCircle } from "lucide-react";

import React from "react";

import { TableOfContents } from "./TableOfContents";

export const ReferencesSidebar: React.FC<{
  editor?: string;
}> = ({ editor }) => {
  const scrollToSection = (sectionId: string) => {
    // console.log("scrollto", sectionId);
    const sectionElement = document.querySelector(sectionId); // Find the section
    if (sectionElement) {
      sectionElement.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      console.error("Section not found:", sectionId);
    }
  };
  return (
    <div className="fixed top-4 flex h-full flex-col p-4">
      <h3 className="mb-4 text-sm font-bold">On this page</h3>

      {/* Sticky TOC with scrolling */}

      <div className="max-h-[75vh] max-w-[330px] flex-grow overflow-y-auto">
        <TableOfContents editor={editor} />
      </div>

      <div className="mt-auto border-t border-neutral-200">
        <ul className="flex flex-col gap-3 py-4">
          <li className="flex items-center gap-2 text-sm">
            <Link2Icon size={20} />
            <a
              className="cursor-pointer hover:text-slate-400"
              onClick={() => scrollToSection("#linkedDocuments")}
            >
              Linked documents
            </a>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <File size={20} />
            <a
              className="cursor-pointer hover:text-slate-400"
              onClick={() => scrollToSection("#connectedQueries")}
            >
              Connected queries
            </a>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <MessageCircle size={20} />
            <a
              className="cursor-pointer hover:text-slate-400"
              onClick={() => scrollToSection("#connectedComments")}
            >
              Page comments
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReferencesSidebar;

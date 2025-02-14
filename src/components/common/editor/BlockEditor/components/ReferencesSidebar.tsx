import { toggleInnerSidebar } from "@/api/utilities/sidebarSlice";

import { useEffect } from "react";
import React from "react";

import { TableOfContents } from "../../TableOfContents";

// import { useSelector } from "react-redux";

export const ReferencesSidebar: React.FC<{
  editor?: string;
}> = ({ editor }) => {
  const scrollToSection = (sectionId: string) => {
    console.log("scrollto", sectionId);
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
    <div className="flex h-[calc(100vh-4rem)] flex-col p-4 transition-all duration-300">
      <h3 className="mb-4 text-sm font-bold">On this page</h3>

      <div className="flex flex-grow flex-col overflow-y-auto">
        <TableOfContents editor={editor} />
      </div>

      {/* Sticky navigation links */}
      <div className="tocNavlinks fixed bottom-0 bg-white py-2 dark:bg-black">
        <ul>
          <li className="text-sm">
            <a className="cursor-pointer" onClick={() => scrollToSection("#linkedDocuments")}>
              Linked documents
            </a>
          </li>
          <li className="text-sm">
            <a className="cursor-pointer" onClick={() => scrollToSection("#connectedQueries")}>
              Connected queries
            </a>
          </li>
          <li className="text-sm">
            <a className="cursor-pointer" onClick={() => scrollToSection("#connectedComments")}>
              Page comments
            </a>
          </li>
          <li className="text-sm">
            <a className="cursor-pointer" onClick={() => scrollToSection("#mainEditorStart")}>
              Back to Top
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReferencesSidebar;

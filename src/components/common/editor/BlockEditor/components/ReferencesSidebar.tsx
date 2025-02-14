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
    <div className="fixed flex flex-col p-4 transition-all duration-300">
      <div className="flex flex-row justify-between">
        <h3 className="mb-4 text-sm font-bold">On this page</h3>
      </div>

      <div className="flex h-[100vh] flex-col gap-4 overflow-y-scroll">
        <TableOfContents editor={editor} />
        <div>
          <ul>
            <li className="tsxt-sm">
              <a className="cursor-pointer" onClick={() => scrollToSection("#linkedDocuments")}>
                Linked documents
              </a>
            </li>
            <li className="tsxt-sm">
              <a className="cursor-pointer" onClick={() => scrollToSection("#connectedQueries")}>
                Conneceted queries
              </a>
            </li>
            <li className="tsxt-sm">
              <a className="cursor-pointer" onClick={() => scrollToSection("#connectedComments")}>
                Page comments
              </a>
            </li>
            <li className="tsxt-sm">
              <a className="cursor-pointer" onClick={() => scrollToSection("#mainEditorStart")}>
                Back to Top
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReferencesSidebar;

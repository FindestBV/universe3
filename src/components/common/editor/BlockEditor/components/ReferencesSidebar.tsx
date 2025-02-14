import { toggleInnerSidebar } from "@/api/utilities/sidebarSlice";
import { TableOfContents } from "@/components/common/editor/TableOfContents";
import { ReferencesSearchbar } from "@/components/common/search/references-searchbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
  BookOpenCheck,
  FileText,
  Fingerprint,
  Highlighter,
  Inbox,
  Info,
  Link,
  List,
  Paperclip,
  Quote,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import React from "react";

// import { useSelector } from "react-redux";

export const ReferencesSidebar: React.FC<{
  isCollapsed?: boolean;
  editor?: string;
}> = ({ isCollapsed, editor }) => {
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

  useEffect(() => {
    toggleInnerSidebar();
  }, []);

  return (
    <>
      {/* Sidebar Content */}
      {!isCollapsed && (
        <div className="fixed flex flex-col p-4 transition-all duration-300">
          <div className="flex flex-row justify-between">
            {/* <Button
              className="fixed right-0"
              onClick={() => {
                console.log("X button clicked, toggling sidebar");
                onToggleInnerSidebar();
              }}
            >
              <X size={20} />
            </Button> */}
            <h3 className="mb-4 text-sm font-bold">On this page</h3>
          </div>

          <div className="flex h-[100vh] flex-col gap-20">
            <div>
              <TableOfContents editor={editor} />
            </div>
            <div>
              <ul>
                <li>
                  <a className="cursor-pointer" onClick={() => scrollToSection("#linkedDocuments")}>
                    Linked
                  </a>
                </li>
                <li>
                  <a
                    className="cursor-pointer"
                    onClick={() => scrollToSection("#connectedQueries")}
                  >
                    Queries
                  </a>
                </li>
                <li>
                  <a
                    className="cursor-pointer"
                    onClick={() => scrollToSection("#connectedComments")}
                  >
                    Comments
                  </a>
                </li>
                <li>
                  <a className="cursor-pointer" onClick={() => scrollToSection("#mainEditorStart")}>
                    Back to Top
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReferencesSidebar;

import { toggleInnerSidebar } from "@/api/utilities/sidebarSlice";
import { TableOfContents } from "@/components/common/editor/BlockEditor/components/TableOfContents";
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
  onToggleInnerSidebar?: () => void;
  isCollapsed?: boolean;
  connectedEntities?: string;
  connectedDocs?: string;
  connectedInbox?: string;
  connectedHighlights?: string;
  connectedObjects?: string;
  connectedStudies?: string;
  editor?: string;
}> = ({
  onToggleInnerSidebar,
  isCollapsed,
  connectedEntities,
  connectedInbox,
  connectedHighlights,
  connectedObjects,
  connectedStudies,
  editor,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<string>("references"); // Main tab
  const [activeSubTab, setActiveSubTab] = useState<string>("inbox"); // Sub-tab for references

  const toggleActiveSubTab = (tab: React.SetStateAction<string>) => {
    if (isCollapsed) {
      onToggleInnerSidebar();
    }
    setActiveMainTab(tab);
  };

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

  useEffect(() => {
    toggleInnerSidebar();
  }, []);

  return (
    <>
      {/* Persistent Panel */}
      <div className="fixed z-10 -ml-14 flex h-[100px] flex-col items-center gap-4 bg-white p-4 shadow-md">
        {/* Toggle Main Tabs */}
        <button
          onClick={() => toggleActiveSubTab("references")}
          className={`${activeMainTab === "references" ? "text-blue-500" : "text-gray-400"}`}
        >
          <List size={24} />
        </button>
        <button
          onClick={() => toggleActiveSubTab("onThisPage")}
          className={`${activeMainTab === "onThisPage" ? "text-blue-500" : "text-gray-400"}`}
        >
          <Quote size={24} />
        </button>
      </div>

      {/* Sidebar Content */}
      {!isCollapsed && (
        <div className="fixed flex flex-col p-4 transition-all duration-300">
          <div className="flex flex-row justify-between">
            <Button
              className="fixed right-0"
              onClick={() => {
                // console.log("X button clicked, toggling sidebar");
                onToggleInnerSidebar();
              }}
            >
              <X size={20} />
            </Button>
            <h3 className="mb-4 text-xl font-bold">
              {activeMainTab === "references" ? "References" : "On This Page"}
            </h3>
          </div>

          {/* Main Tabs */}
          <Tabs
            defaultValue="references"
            value={activeMainTab}
            onValueChange={setActiveMainTab}
            className="mt-4"
          >
            {/* References Tab Content */}
            <TabsContent value="references">
              <ReferencesSearchbar />

              <Tabs
                defaultValue="documents"
                value={activeSubTab}
                onValueChange={setActiveSubTab}
                className="mt-4"
              >
                <TabsList className="mb-4 inline-flex h-10 w-full items-center justify-start gap-4 rounded-none border-b border-[#f1f1f1] bg-transparent p-1 text-muted-foreground">
                  <TabsTrigger value="inbox">
                    <Inbox
                      size={18}
                      className={activeSubTab === "inbox" ? "text-black" : "text-muted-foreground"}
                    />
                  </TabsTrigger>
                  {connectedHighlights && (
                    <TabsTrigger value="highlights">
                      <Highlighter
                        size={18}
                        className={
                          activeSubTab === "highlights" ? "text-black" : "text-muted-foreground"
                        }
                      />
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="documents">
                    <FileText
                      size={18}
                      className={
                        activeSubTab === "documents" ? "text-black" : "text-muted-foreground"
                      }
                    />
                  </TabsTrigger>

                  <TabsTrigger value="attachments">
                    <Paperclip
                      size={18}
                      className={
                        activeSubTab === "attachments" ? "text-black" : "text-muted-foreground"
                      }
                    />
                  </TabsTrigger>
                  <TabsTrigger value="entities">
                    <Fingerprint
                      size={18}
                      className={
                        activeSubTab === "entities" ? "text-black" : "text-muted-foreground"
                      }
                    />
                  </TabsTrigger>
                  <TabsTrigger value="studies">
                    <BookOpenCheck
                      size={18}
                      className={
                        activeSubTab === "studies" ? "text-black" : "text-muted-foreground"
                      }
                    />
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="inbox">
                  {connectedInbox
                    ? Object.entries(connectedInbox).map((doc, index) => (
                        <div key={index} className="mb-2 flex items-start gap-2">
                          <Link size={18} />
                          <a href={"#"} className="text-gray-700 hover:text-black">
                            <p className="text-sm">{doc[1]?.documentTitle}</p>
                          </a>
                        </div>
                      ))
                    : "No connected inbox items."}
                </TabsContent>
                {connectedHighlights && (
                  <>
                    <TabsContent value="highlights">
                      <h1>Highlights Content</h1>
                    </TabsContent>
                  </>
                )}
                <TabsContent value="documents">
                  {connectedObjects?.documents && connectedObjects.documents.length > 0 ? (
                    connectedObjects.documents.map(
                      (doc: { title: any }, index: React.Key | null | undefined) => (
                        <div key={index} className="mb-2 flex items-start gap-2">
                          <Link size={18} />
                          <a href={"#"} className="text-gray-700 hover:text-black">
                            <p className="text-sm">{doc.title || "Untitled Document"}</p>
                          </a>
                        </div>
                      ),
                    )
                  ) : (
                    <div className="flex gap-2">
                      <Info size={18} />
                      <div>
                        <p className="text-xs italic">
                          Documents that are saved inside your Universe appear here.
                          <br />
                          <br />
                          You add documents to this view by saving the using the browser extensino
                          and adding a highlight, image or linking the document.
                          <br />
                          Highlights and images that you have saved from these documents can easily
                          be injected into the current page.
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="attachments">
                  <h1>Attachments Content</h1>
                </TabsContent>
                <TabsContent value="entities">
                  {connectedEntities && connectedEntities.length > 0 ? (
                    connectedEntities.map(
                      (doc: { documentTitle: string }, index: React.Key | null | undefined) => (
                        <div key={index} className="mb-2 flex items-start gap-2">
                          <Link size={18} />
                          <a href={"#"} className="text-gray-700 hover:text-black">
                            <small>Entity</small>
                            <p className="text-sm">{doc.documentTitle || "Untitled Document"}</p>
                          </a>
                        </div>
                      ),
                    )
                  ) : (
                    <div className="flex gap-2">
                      <Info size={18} />
                      <div>
                        <p className="text-xs italic">
                          Entities from your Universe appear here.
                          <br />
                          You can create entities from the Entities page in the library or using the
                          browser extension!
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="studies">
                  {connectedStudies && connectedStudies.length > 0 ? (
                    connectedStudies.map(
                      (doc: { name: any }, index: React.Key | null | undefined) => (
                        <div key={index} className="mb-2 flex items-start gap-2">
                          <Link size={24} />
                          <a href={"#"} className="text-gray-700 hover:text-black">
                            <small>Study/Queries</small>
                            <p className="text-sm">{doc.name || "Untitled Document"}</p>
                          </a>
                        </div>
                      ),
                    )
                  ) : (
                    <>
                      <p className="text-xs italic">Studies from your Universe appear here.</p>
                      <br />
                      <p className="text-xs italic">
                        You can create studies from the Studies page in the library or using the
                        browser extension!
                      </p>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* On This Page Tab Content */}
            <TabsContent value="onThisPage">
              <div className="flex h-[100vh] flex-col gap-20">
                <div>
                  <TableOfContents editor={editor} />
                </div>
                <div>
                  <ul>
                    <li>
                      <a
                        className="cursor-pointer"
                        onClick={() => scrollToSection("#linkedDocuments")}
                      >
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
                      <a
                        className="cursor-pointer"
                        onClick={() => scrollToSection("#mainEditorStart")}
                      >
                        Back to Top
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default ReferencesSidebar;

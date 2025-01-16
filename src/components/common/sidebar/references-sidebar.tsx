import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
  BookOpenCheck,
  FileText,
  Fingerprint,
  Highlighter,
  Inbox,
  Link,
  List,
  Paperclip,
  Quote,
  X,
} from "lucide-react";

import { useState } from "react";
import React from "react";

// import AddLinkToItem from "../dialogs/add-link-to-item";
import { ReferencesSearchbar } from "../search/references-searchbar";

export const ReferencesSidebar: React.FC<{
  onToggleSidebar: () => void;
  isCollapsed: boolean;
  connectedDocs?: string;
  connectedInbox?: string;
  connectedObjects?: string;
}> = ({ onToggleSidebar, isCollapsed, connectedInbox, connectedObjects }) => {
  const [activeMainTab, setActiveMainTab] = useState<string>("references"); // Main tab
  const [activeSubTab, setActiveSubTab] = useState<string>("documents"); // Sub-tab for references

  const toggleActiveSubTab = (tab) => {
    if (isCollapsed) {
      onToggleSidebar();
    }
    setActiveMainTab(tab);
  };

  const scrollToSection = (sectionId) => {
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
    <>
      {/* Persistent Panel */}
      <div className="absolute top-0 z-10 -ml-14 mt-4 flex h-[100px] flex-col items-center gap-4 bg-white p-4 shadow-md">
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
        <div className="flex flex-col p-4 transition-all duration-300">
          <div className="flex flex-row justify-between">
            <Button
              className="fixed right-0"
              onClick={() => {
                console.log("X button clicked, toggling sidebar");
                onToggleSidebar();
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
                      size={16}
                      className={activeSubTab === "inbox" ? "text-black" : "text-muted-foreground"}
                    />
                  </TabsTrigger>
                  <TabsTrigger value="highlights">
                    <Highlighter
                      size={16}
                      className={
                        activeSubTab === "highlights" ? "text-black" : "text-muted-foreground"
                      }
                    />
                  </TabsTrigger>
                  <TabsTrigger value="documents">
                    <FileText
                      size={16}
                      className={
                        activeSubTab === "documents" ? "text-black" : "text-muted-foreground"
                      }
                    />
                  </TabsTrigger>
                  <TabsTrigger value="attachments">
                    <Paperclip
                      size={16}
                      className={
                        activeSubTab === "attachments" ? "text-black" : "text-muted-foreground"
                      }
                    />
                  </TabsTrigger>
                  <TabsTrigger value="entities">
                    <Fingerprint
                      size={16}
                      className={
                        activeSubTab === "entities" ? "text-black" : "text-muted-foreground"
                      }
                    />
                  </TabsTrigger>
                  <TabsTrigger value="studies">
                    <BookOpenCheck
                      size={16}
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
                          <Link size={24} />
                          <a href={"#"} className="text-gray-700 hover:text-black">
                            <p>{doc[1]?.documentTitle}</p>
                          </a>
                        </div>
                      ))
                    : "No connected inbox items."}
                </TabsContent>
                <TabsContent value="highlights">
                  <h1>Highlights Content</h1>
                </TabsContent>
                <TabsContent value="documents">
                  {connectedObjects?.documents && connectedObjects.documents.length > 0
                    ? connectedObjects.documents.map((doc, index) => (
                        <div key={index} className="mb-2 flex items-start gap-2">
                          <Link size={24} />
                          <a href={"#"} className="text-gray-700 hover:text-black">
                            <p>{doc.title || "Untitled Document"}</p>
                          </a>
                        </div>
                      ))
                    : "No connected objects."}
                </TabsContent>
                <TabsContent value="attachments">
                  <h1>Attachments Content</h1>
                </TabsContent>
                <TabsContent value="entities">
                  <h1>Entities Content</h1>
                </TabsContent>
                <TabsContent value="studies">
                  <h1>Studies Content</h1>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* On This Page Tab Content */}
            <TabsContent value="onThisPage">
              <div class="flex h-full flex-col justify-between">
                <div>
                  <h1>Table of Contents.</h1>
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

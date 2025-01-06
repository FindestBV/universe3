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

// import AddLinkToItem from "../modals/add-link-to-item";
import { ReferencesSearchbar } from "../search/references-searchbar";

export const ReferencesSidebar: React.FC<{
  onToggleSidebar: () => void;
  isCollapsed: boolean;
  connectedDocs?: string;
  connectedInbox?: string;
  connectedObjects?: string;
}> = ({ onToggleSidebar, isCollapsed, connectedInbox, connectedObjects }) => {
  const [activeTab, setActiveTab] = useState<string>("documents"); // Initial active tab

  return (
    <>
      {/* Persistent Panel */}
      <div className="absolute top-0 z-10 -ml-14 mt-4 flex h-[100px] flex-col items-center gap-4 bg-white p-4 shadow-md">
        {/* Toggle Sidebar */}
        <button
          onClick={() => {
            console.log("List button clicked, toggling sidebar");
            onToggleSidebar();
          }}
        >
          <List size={24} />
        </button>
        <button>
          <Quote size={24} />
        </button>
      </div>

      {/* Sidebar Content */}
      {!isCollapsed && (
        <div className="flex flex-col p-4 transition-all duration-300">
          <div className="flex justify-between">
            <h3 className="mb-4 text-xl font-bold">References</h3>
            <Button
              className="fixed right-0"
              onClick={() => {
                console.log("X button clicked, toggling sidebar");
                onToggleSidebar();
              }}
            >
              <X size={20} />
            </Button>
          </div>

          <ReferencesSearchbar />
          <Tabs
            defaultValue="documents"
            className="mt-4"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-4 inline-flex h-10 w-full items-center justify-start gap-4 rounded-none border-b border-[#f1f1f1] bg-transparent p-1 text-muted-foreground">
              <TabsTrigger value="inbox">
                <Inbox
                  size={16}
                  className={activeTab === "inbox" ? "text-black" : "text-muted-foreground"}
                />
              </TabsTrigger>
              <TabsTrigger value="highlights">
                <Highlighter size={16} />
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText
                  size={16}
                  className={activeTab === "documents" ? "text-black" : "text-muted-foreground"}
                />
              </TabsTrigger>
              <TabsTrigger value="attachments">
                <Paperclip
                  size={16}
                  className={activeTab === "attachments" ? "text-black" : "text-muted-foreground"}
                />
              </TabsTrigger>
              <TabsTrigger value="entities">
                <Fingerprint
                  size={16}
                  className={activeTab === "entities" ? "text-black" : "text-muted-foreground"}
                />
              </TabsTrigger>
              <TabsTrigger value="studies">
                <BookOpenCheck
                  size={16}
                  className={activeTab === "studies" ? "text-black" : "text-muted-foreground"}
                />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="inbox">
              {connectedInbox
                ? connectedInbox &&
                  Object.entries(connectedInbox).map((doc, index) => (
                    <div key={index} className="mb-2 flex items-start gap-2">
                      <Link size={24} />
                      <a href={"#"} className="font-bold">
                        {doc[1]?.documentTitle}
                      </a>
                    </div>
                  ))
                : "no connected objects"}
            </TabsContent>
            <TabsContent value="highlights">
              <h1>Highlights Content</h1>
            </TabsContent>
            <TabsContent value="attachments">
              <h1>Attachments Content</h1>
            </TabsContent>
            <TabsContent value="documents">
              {connectedObjects?.documents && connectedObjects.documents.length > 0
                ? connectedObjects.documents.map((doc, index) => (
                    <div key={index} className="mb-2 flex items-center gap-2">
                      <Link size={24} />
                      <a href={"#"} className="font-bold">
                        {doc.title || "Untitled Document"}
                      </a>
                    </div>
                  ))
                : "no connected objects"}
            </TabsContent>
            <TabsContent value="entities">
              <h1>Entities Content</h1>
            </TabsContent>
            <TabsContent value="studies">
              <h1>Studies Content</h1>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default ReferencesSidebar;

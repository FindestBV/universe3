import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
  BookOpenCheck,
  FileText,
  Fingerprint,
  Highlighter,
  Inbox,
  List,
  Paperclip,
  Quote,
  X,
} from "lucide-react";

import React from "react";

import { ReferencesSearchbar } from "../search/references-searchbar";

export const ReferencesSidebar: React.FC<{ onToggleSidebar: () => void; isCollapsed: boolean }> = ({
  onToggleSidebar,
  isCollapsed,
}) => {
  console.log("is collapsed", isCollapsed);

  return (
    <div
      className={`relative flex h-full flex-col transition-all duration-300 ${
        isCollapsed ? "w-0" : "w-1/4"
      } border-l border-gray-200`}
    >
      {/* Persistent Panel */}
      <div className="absolute top-0 z-10 -ml-14 mt-4 flex h-[100px] flex-col items-center gap-4 bg-white p-4 shadow-md">
        <button onClick={onToggleSidebar}>
          <List size={24} />
        </button>
        <button>
          <Quote size={24} />
        </button>
      </div>

      {/* Sidebar Content */}
      {!isCollapsed && (
        <div className="flex flex-col p-4 transition-all duration-300">
          <div className="flex items-center justify-between">
            <h3 className="mb-4 text-xl font-bold">References</h3>
            <Button className="fixed right-0" onClick={onToggleSidebar}>
              <X size={20} />
            </Button>
          </div>

          <ReferencesSearchbar />
          <Tabs defaultValue="inbox" className="mt-4">
            <TabsList className="mb-4 inline-flex h-10 w-full items-center justify-start gap-4 rounded-none border-b border-[#f1f1f1] bg-transparent p-1 text-muted-foreground">
              <TabsTrigger value="inbox">
                <Inbox size={16} />
              </TabsTrigger>
              <TabsTrigger value="highlights">
                <Highlighter size={16} />
              </TabsTrigger>
              <TabsTrigger value="attachments">
                <Paperclip size={16} />
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText size={16} />
              </TabsTrigger>
              <TabsTrigger value="entities">
                <Fingerprint size={16} />
              </TabsTrigger>
              <TabsTrigger value="studies">
                <BookOpenCheck size={16} />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="inbox">
              <h1>Inbox Content</h1>
            </TabsContent>
            <TabsContent value="highlights">
              <h1>Highlights Content</h1>
            </TabsContent>
            <TabsContent value="attachments">
              <h1>Attachments Content</h1>
            </TabsContent>
            <TabsContent value="documents">
              <h1>Documents Content</h1>
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
    </div>
  );
};

export default ReferencesSidebar;
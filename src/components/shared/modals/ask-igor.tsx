import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Bot } from "lucide-react";

import { useState } from "react";

const AskIgorModal: React.FC = () => {
  return (
    <Dialog>
      {/* Trigger to Open Dialog */}
      <DialogTrigger asChild>
        <div>
          <button className="flex items-center gap-1 rounded-md border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200">
            <Bot className="h-4" />
            Ask IGOR<sup>AI</sup>
          </button>
        </div>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="flex h-[80vh] max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-lg md:flex-row">
        <Tabs defaultValue="tab1" className="flex h-full w-full flex-row">
          {/* Left Panel */}
          <div className="w-full flex-shrink-0 bg-gray-100 p-4 md:w-1/3">
            <h3 className="mb-4 text-lg font-bold text-gray-800">Items</h3>
            <TabsList className="flex flex-col gap-2">
              <TabsTrigger
                value="tab1"
                className="w-full rounded-md bg-gray-200 px-4 py-2 text-left hover:bg-gray-300"
              >
                Item 1
              </TabsTrigger>
              <TabsTrigger
                value="tab2"
                className="w-full rounded-md bg-gray-200 px-4 py-2 text-left hover:bg-gray-300"
              >
                Item 2
              </TabsTrigger>
              <TabsTrigger
                value="tab3"
                className="w-full rounded-md bg-gray-200 px-4 py-2 text-left hover:bg-gray-300"
              >
                Item 3
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Right Panel */}
          <div className="w-full flex-grow p-4 md:w-2/3">
            <TabsContent value="tab1">
              <h3 className="text-lg font-semibold">Content for Item 1</h3>
              <p>This is the content displayed for the first item.</p>
            </TabsContent>
            <TabsContent value="tab2">
              <h3 className="text-lg font-semibold">Content for Item 2</h3>
              <p>This is the content displayed for the second item.</p>
            </TabsContent>
            <TabsContent value="tab3">
              <h3 className="text-lg font-semibold">Content for Item 3</h3>
              <p>This is the content displayed for the third item.</p>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AskIgorModal;

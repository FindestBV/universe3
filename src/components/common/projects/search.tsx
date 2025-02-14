import { Button } from "@/components/ui/button";
// import { AskIgor } from "@/stories/04-utilities/dialog/Dialog.stories";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { ChevronRight, File, Network, Plus, Search } from "lucide-react";

import { useState } from "react";

import VotingCard from "../cards/voting-card";
import AskIgorModal from "../dialogs/ask-igor";
import CreateItemModal from "../dialogs/create-item-dialog";
import ProjectSearchDialog from "../dialogs/project-search-dialog";
import SearchBar from "../search/searchbar";

function PresetButton({
  title,
  description,
}: {
  title?: string;
  description?: string;
  className: string;
}) {
  return (
    <Button
      variant="ghost"
      className="group h-auto w-full justify-between bg-slate-100 p-2 hover:bg-slate-400"
    >
      <div className="flex items-start gap-4">
        <div className="text-left">
          <h3 className="font-medium group-hover:text-white">{title}</h3>
          <p className="text-sm text-gray-600 group-hover:text-white">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4" />
    </Button>
  );
}

export const ProjectSearch = () => {
  const [activeTabActive, setIsActiveTabActive] = useState<string>("overview");
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="min-h-full">
        <div className="mx-auto max-w-full p-8">
          <div className="overviewHeader">
            <h1 className="mb-2 text-4xl font-bold">Project search</h1>

            <SearchBar />
            {/* <div className="item-start flex gap-4">
              <span className="flex items-center gap-2">
                <File
                  size={24}
                  className="h-50 rounded-sm bg-gray-100 p-1 text-gray-600 hover:bg-gray-200"
                />
                <Search
                  size={24}
                  className="rounded-sm bg-gray-100 p-1 text-gray-600 hover:bg-gray-200"
                />
                <Plus
                  size={24}
                  className="rounded-sm bg-gray-100 p-1 text-gray-600 hover:bg-gray-200"
                />
              </span>
              <AskIgorModal />
            </div> */}
          </div>
          <div className="mt-16">
            <Tabs defaultValue="overview" className="pb-4" onValueChange={setIsActiveTabActive}>
              <TabsList className="flex w-full justify-start gap-2 rounded-none border-b border-slate-300 bg-transparent">
                <TabsTrigger
                  value="overview"
                  className={`linear p-2 text-sm transition-all duration-150 ${
                    activeTabActive === "overview"
                      ? "border-b-2 border-blue-800 bg-blue-200 font-bold"
                      : "text-black"
                  }`}
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="technologies"
                  className={`linear p-2 text-sm transition-all duration-150 ${
                    activeTabActive === "technologies"
                      ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                      : "text-black"
                  }`}
                >
                  Technologies
                </TabsTrigger>
                <TabsTrigger
                  value="queries"
                  className={`linear p-2 text-sm transition-all duration-150 ${
                    activeTabActive === "queries"
                      ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                      : "text-black"
                  }`}
                >
                  Queries
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-2 space-y-2">
                <PresetButton
                  title="Other general keyword"
                  description="Either based on general knowledge or the sources linked."
                  className="bg-slate-100"
                />
                <PresetButton
                  title="General description"
                  description="Either based on general knowledge or the sources linked."
                  className="bg-slate-100"
                />
                <PresetButton
                  title="Other general keyword"
                  description="Either based on general knowledge or the sources linked."
                  className="bg-slate-100"
                />
              </TabsContent>
              <TabsContent value="technologies" className="mt-2 space-y-2">
                <VotingCard star={4} />
                <VotingCard star={4} />
                <VotingCard star={3} />
                <VotingCard star={3} />
                <VotingCard star={2} />
                <VotingCard star={1} />
                <VotingCard star={1} />

                <div className="h-50 group flex items-center justify-center bg-gray-100">
                  <div className="mx-auto flex w-full items-center justify-center rounded-sm bg-slate-100 p-2 group-hover:bg-slate-200">
                    <Plus
                      size={24}
                      className="cursor-pointer text-slate-300 group-hover:text-slate-400"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="queries" className="mt-2 space-y-2">
                <h3>Active Queries</h3>
                <PresetButton
                  title="Other general keyword"
                  description="Either based on general knowledge or the sources linked."
                  className="bg-slate-100"
                />
                <PresetButton
                  title="General description"
                  description="Either based on general knowledge or the sources linked."
                  className="bg-slate-100"
                />
                <PresetButton
                  title="Other general keyword"
                  description="Either based on general knowledge or the sources linked."
                  className="bg-slate-100"
                />
                <PresetButton
                  title="General description"
                  description="Either based on general knowledge or the sources linked."
                  className="bg-slate-100"
                />
                <PresetButton
                  title="Waterboarding"
                  description="Either based on general knowledge or the sources linked."
                  className="bg-slate-100"
                />
                <h3>Other Queries</h3>
                <PresetButton
                  title="Sleep deprevation"
                  description="Either based on general knowledge or the sources linked."
                  className="bg-slate-100"
                />
                <PresetButton
                  title="Constant Annoyance"
                  description="Either based on general knowledge or the sources linked."
                  className="bg-slate-100"
                />
                <PresetButton
                  title="Drilling noises"
                  description="Either based on general knowledge or the sources linked."
                  className="bg-slate-100"
                />
                <Button className="border border-slate-300 bg-slate-100 text-black hover:bg-slate-200">
                  <Plus /> Create new query
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectSearch;

import { Button } from "@/components/ui/button";
// import { AskIgor } from "@/stories/04-utilities/dialog/Dialog.stories";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { ChevronRight, File, Plus, Search } from "lucide-react";

import { useState } from "react";

import VotingCard from "../cards/voting-card";
import AskIgorModal from "../dialogs/ask-igor";
import CreateItemModal from "../dialogs/create-item-dialog";
import ProjectSearchDialog from "../dialogs/project-search-dialog";

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

export const ProjectOverView = () => {
  const [tabs, setTabs] = useState([
    { id: "overview", label: "Overview" },
    { id: "technologies", label: "Technologies" },
    { id: "queries", label: "Queries" },
  ]);
  const [activeTabActive, setIsActiveTabActive] = useState<string>("overview");

  // Function to add a new tab with a user-defined label
  const addNewTab = () => {
    const newLabel = window.prompt("Enter a name for the new tab:", `New Tab ${tabs.length + 1}`);
    if (!newLabel) return; // Prevent adding empty tabs

    const newId = `tab-${tabs.length + 1}`;
    setTabs([...tabs, { id: newId, label: newLabel }]);
    setIsActiveTabActive(newId);
  };

  // Function to rename an existing tab
  const renameTab = (id: string) => {
    const newLabel = window.prompt("Rename this tab:");
    if (!newLabel) return;

    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === id ? { ...tab, label: newLabel } : tab)),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="min-h-full" id="projects-overview">
        <div className="mx-auto max-w-full p-8">
          <div className="overviewHeader">
            <h1 className="mb-2 text-4xl font-bold">
              Cross regeneration to maximimise macromolecule effusion.
            </h1>
            <p className="mb-4 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam autem, deleniti
              ratione fuga consectetur sint unde nostrum, numquam corrupti esse, porro ullam
              dolorum. Repudiandae laborum sit fugit. Ipsum odit mollitia molestiae nobis asperiores
              laborum, modi quos quisquam quibusdam, consectetur nostrum officiis veritatis iure ab
              distinctio, veniam nesciunt voluptas sed! Magnam praesentium id tenetur ducimus error
              magni quidem similique suscipit ad animi consequatur ipsa nobis numquam qui sed ullam
              nulla, voluptatibus iusto eaque accusantium sapiente.
            </p>
            <div className="item-start flex gap-4">
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
            </div>
          </div>
          <div className="mt-16">
            <Tabs defaultValue="overview" className="pb-4" onValueChange={setIsActiveTabActive}>
              <TabsList className="flex w-full items-center justify-between border-b border-slate-300 bg-transparent">
                <div className="flex gap-2">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={`p-2 text-sm ${activeTabActive === tab.id ? "border-b-2 border-blue-800 bg-blue-200 font-bold" : "text-black"}`}
                      onDoubleClick={() => renameTab(tab.id)} // Double-click to rename
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={addNewTab}
                    className="flex items-center rounded-md p-2 text-gray-600 hover:bg-gray-200"
                  >
                    <Plus className="h-5 w-8" />
                  </button>
                  <AskIgorModal iconOnly={true} />
                </div>
              </TabsList>
              {/* {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-2 space-y-2">
                  <p className="p-4 text-sm">Content for {tab.label}</p>
                </TabsContent>
              ))} */}
              <TabsContent value="overview" className="mt-2 space-y-2">
                <div className="w-1/2">
                  <h3 className="text-md mb-2 pt-3 font-semibold">Get started</h3>
                  <div className="flex flex-col gap-2">
                    <CreateItemModal title={"Create a scientific landscape"} />
                    <CreateItemModal title={"Create a technology overview"} />
                  </div>
                  <br />
                  <div className="flex flex-col gap-2">
                    <ProjectSearchDialog />
                    <PresetButton title="Extract Patents" className="bg-slate-100" />
                    <PresetButton
                      title="Extract Scientific Publications"
                      className="bg-slate-100"
                    />
                    <PresetButton title="Extract from Scientific Topics" className="bg-slate-100" />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="technologies" className="mt-2 space-y-2">
                <VotingCard star={4} />
                <VotingCard star={4} />
                <VotingCard star={3} />
                <VotingCard star={3} />
                <VotingCard star={2} />
                <VotingCard star={1} />
                <VotingCard star={3} />
                <VotingCard star={2} />
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

export default ProjectOverView;

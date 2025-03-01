/**
 * ProjectOverView component provides an overview of projects with tab navigation.
 * This is Relevant for Universe Projects
 *
 * @component
 * @example
 * return <ProjectOverView />;
 *
 * @returns {JSX.Element} A project overview component with dynamic tab functionality.
 */
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { ChevronRight, Plus, Search } from "lucide-react";

import { useState } from "react";
import { useLocation } from "react-router";

import VotingCard from "../cards/voting-card";
import AskIgorModal from "../dialogs/ask-igor";
import ConnectQuery from "../dialogs/connect-query";
import CreateItemModal from "../dialogs/create-item-dialog";
import CreateProjectDialog from "../dialogs/create-project-dialog";
import ProjectSearchDialog from "../dialogs/project-search-dialog";
import { DevBanner } from "../layout/dev-banner";
import OverviewForceDirected from "../layout/overview-force-directed";

const dummyData = [
  { id: "1", name: "Root", lowerLevelNodes: ["2", "3"] },
  { id: "2", name: "Child A", lowerLevelNodes: ["4", "5"] },
  { id: "3", name: "Child B", lowerLevelNodes: [] },
  { id: "4", name: "Leaf A1", lowerLevelNodes: [] },
  { id: "5", name: "Leaf A2", lowerLevelNodes: [] },
];

const dialogs = [
  { id: "1", title: "Extract Information" },
  { id: "2", title: "Extract Patents" },
  { id: "3", title: "Answer a Specific Question" },
  { id: "4", title: "Explore a specific technology" },
];

/**
 * PresetButton component renders a button with a title and description.
 *
 * @component
 * @param {Object} props - The properties of the PresetButton component.
 * @param {string} [props.title] - The title of the button.
 * @param {string} [props.description] - The description displayed under the title.
 * @param {string} props.className - Additional CSS classes for styling.
 * @returns {JSX.Element} A styled button component.
 */

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
  const location = useLocation();
  const currentPath = location.pathname;

  const isProjectsDashboard = currentPath.includes("/projects/dashboard");
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
      <div className="min-h-full w-full" id="projects-overview">
        {isProjectsDashboard && <DevBanner />}
        <div className="mx-auto w-full p-8">
          <Tabs
            defaultValue="overview"
            className="w-full pb-4"
            onValueChange={setIsActiveTabActive}
          >
            <TabsList className="flex w-full items-center justify-between border-b border-slate-300 bg-transparent">
              <div className="flex gap-2">
                <TabsTrigger
                  key={"search"}
                  value={"search"}
                  className={`p-2 text-sm ${activeTabActive === "search" ? "border-b-2 border-blue-800 bg-blue-200 font-bold" : "text-black"}`}
                >
                  <Search size={18} />
                </TabsTrigger>
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`p-2 text-sm transition-all duration-150 ${activeTabActive === tab.id ? "border-b-2 border-blue-800 bg-blue-200 font-bold" : "text-black"}`}
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
            <TabsContent value="overview" className="mt-2 space-y-2 transition-all duration-150">
              <>
                <div className="overviewHeader py-4">
                  <h1 className="mb-4 text-4xl font-bold">
                    {isProjectsDashboard
                      ? "Your Universe Projects"
                      : "Cross regeneration to maximimise macromolecule effusion."}
                  </h1>
                  <p className="mb-4 text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam autem, deleniti
                    ratione fuga consectetur sint unde nostrum, numquam corrupti esse, porro ullam
                    dolorum. Repudiandae laborum sit fugit. Ipsum odit mollitia molestiae nobis
                    asperiores laborum, modi quos quisquam quibusdam, consectetur nostrum officiis
                    veritatis iure ab distinctio, veniam nesciunt voluptas sed! Magnam praesentium
                    id tenetur ducimus error magni quidem similique suscipit ad animi consequatur
                    ipsa nobis numquam qui sed ullam nulla, voluptatibus iusto eaque accusantium
                    sapiente.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1/2">
                    <h3 className="text-md mb-2 pt-3 font-semibold">Get started</h3>
                    <div className="flex flex-col gap-2">
                      <CreateProjectDialog title={"Create a scientific landscape"} />
                      <CreateItemModal title={"Create a technology overview"} />
                    </div>
                    <br />
                    <div className="flex flex-col gap-2">
                      {dialogs.map((d) => (
                        <ProjectSearchDialog key={d.id} dialogTitle={d.title} />
                      ))}
                    </div>
                  </div>

                  <div className="w-1/2">
                    <h3 className="text-md mb-2 pt-3 font-semibold">Pages graph</h3>

                    <OverviewForceDirected linkingData={dummyData} />
                  </div>
                </div>
              </>
            </TabsContent>
            <TabsContent
              value="technologies"
              className="mt-2 w-full flex-grow space-y-2 transition-all duration-150"
            >
              <div className="flex w-full flex-col">
                {/* Header Row */}
                <div className="flex w-full px-4 py-2 font-semibold">
                  <div className="flex w-1/4 items-center">Rating</div>
                  <div className="flex w-3/4 items-center">Page Titles</div>
                </div>

                {/* List of Voting Cards */}
                <div className="flex w-full flex-col gap-2 py-2">
                  <VotingCard star={4} />
                  <VotingCard star={4} />
                  <VotingCard star={3} />
                  <VotingCard star={3} />
                  <VotingCard star={2} />
                  <VotingCard star={1} />
                </div>
              </div>

              {/* <PresetButton title="Other general keyword" description="Either based on general knowledge or the sources linked." className="bg-slate-100" /> */}
            </TabsContent>
            <TabsContent
              value="queries"
              className="mt-2 space-y-2 py-4 transition-all duration-150"
            >
              <h3 className="py-4 font-bold">Active Queries</h3>
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
              <h3 className="py-4 font-bold">Other Queries</h3>
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
              <ConnectQuery className="mt-2" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectOverView;

/**
 * Project Search component provides an overview of project Pages with tab navigation.
 * This is Relevant for Universe Projects/Pages
 *
 * @component
 * @example
 *
 * @returns {JSX.Element} A project overview component with dynamic tab functionality.
 */
import AskIgorModal from "@/components/common/dialogs/ask-igor";
import SearchBar from "@/components/common/search/searchbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { ChevronRight, Plus } from "lucide-react";

import { useState } from "react";

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

export const ProjectSearch = () => {
  const [activeTabActive, setIsActiveTabActive] = useState<string>("external");

  const [tabs, setTabs] = useState([
    { id: "overview", label: "External document search" },
    // { id: "internal", label: "Internal search" },
  ]);

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
      <div className="min-h-full" id="projects-search">
        <div className="mx-auto max-w-full p-8">
          <div className="overviewHeader">
            <h1 className="mb-2 text-2xl font-bold">Project search</h1>
            <br />
            <div className="mx-auto max-w-[1024px]">
              <SearchBar />
              <div className="mx-auto flex w-full items-center justify-center gap-2 py-2">
                <button
                  type="submit"
                  className="rounded-md bg-black p-2 px-4 text-sm text-white hover:bg-slate-500 focus:outline-none"
                >
                  Search this project
                </button>
                <AskIgorModal label="Chat about this project" />
              </div>
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
                      className={`flex p-2 text-sm transition-all duration-150 ${activeTabActive === tab.id ? "border-b-2 border-blue-800 bg-blue-50 font-bold" : "text-black"}`}
                      onDoubleClick={() => renameTab(tab.id)}
                    >
                      {tab.label}
                      <div className="-mt-2 ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-300 text-xs font-black text-blue-600">
                        3
                      </div>
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
                  <AskIgorModal isToolbar={true} iconOnly={true} />
                </div>
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
            </Tabs>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectSearch;

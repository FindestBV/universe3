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
import { ChevronRight } from "lucide-react";

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
            <h1 className="mb-2 text-4xl font-bold">Project search</h1>
            <br />
            <div className="mx-auto max-w-[1024px]">
              <SearchBar />
              <div className="flex gap-2 py-2">
                <button
                  type="submit"
                  className="rounded-md bg-black p-2 px-4 text-sm text-white hover:bg-slate-500 focus:outline-none"
                >
                  Search this project
                </button>
                <AskIgorModal label="Search for external papers" />
              </div>
            </div>
          </div>
          <div className="mt-16">
            <Tabs defaultValue="overview" className="pb-4" onValueChange={setIsActiveTabActive}>
              <TabsList className="flex w-full justify-start gap-2 rounded-none border-b border-slate-300 bg-transparent">
                <TabsTrigger
                  value="overview"
                  className={`linear p-2 text-sm transition-all duration-150 ${
                    activeTabActive === "external"
                      ? "border-b-2 border-blue-800 bg-blue-50 font-bold"
                      : "text-black"
                  }`}
                >
                  External document search
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
            </Tabs>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectSearch;

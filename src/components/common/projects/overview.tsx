import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { useState } from "react";

function PresetButton({
  title,
  description,
}: {
  title: string;
  description: string;
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
  const [activeTabActive, setIsActiveTabActive] = useState<string>("pages");
  return (
    <motion.div
      className="px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="min-h-full">
        <div className="mx-auto max-w-full p-8">
          <div className="overviewHeader">
            <h1 className="mb-2 text-4xl font-bold">CN109368873A - 一种风电互补海水淡化系统</h1>
          </div>
          <div className="mt-6">
            <Tabs defaultValue="overview" className="pb-4" onValueChange={setIsActiveTabActive}>
              <TabsList className="flex w-full justify-start gap-2 rounded-none border-b border-slate-300 bg-transparent">
                <TabsTrigger
                  value="overview"
                  className={`linear bg-blue-200 p-2 text-sm transition-all duration-150 ${
                    activeTabActive === "overview"
                      ? "border-b-2 border-blue-800 bg-blue-200 font-bold"
                      : "text-gray-500"
                  }`}
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="technology"
                  className={`linear p-2 text-sm transition-all duration-150 ${
                    activeTabActive === "technology"
                      ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                      : "text-gray-500"
                  }`}
                >
                  Technology
                </TabsTrigger>
                <TabsTrigger
                  value="queries"
                  className={`linear p-2 text-sm transition-all duration-150 ${
                    activeTabActive === "queries"
                      ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                      : "text-gray-500"
                  }`}
                >
                  Queries
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-2 space-y-2">
                <PresetButton
                  title="General description"
                  description="Either based on general knowledge or the sources linked."
                  className="bg-slate-100"
                />
                <PresetButton
                  title="Section"
                  description="Give me a title and I will write the section."
                  className="bg-slate-100"
                />
                <PresetButton
                  title="Standard Report"
                  description="Introduction, methods, results and conclusion."
                  className="bg-slate-100"
                />
                <PresetButton
                  title="Tailored Report"
                  description="Introduction, methods, results and conclusion."
                  className="bg-slate-100"
                />
              </TabsContent>
              <TabsContent value="technology" className="mt-2 space-y-2">
                <PresetButton
                  title="Extract Information"
                  description="Search through specific documents."
                  className="bg-slate-100"
                />
                <PresetButton
                  title="Extract Patents"
                  description="Search through specific documents."
                  className="bg-slate-100"
                />
                <PresetButton
                  title="Extract Scientific Publications"
                  description="Search through specific documents."
                  className="bg-slate-100"
                />
                <PresetButton
                  title="Extract from Scientific Topics"
                  description="Search through specific documents."
                  className="bg-slate-100"
                />
              </TabsContent>
              <TabsContent value="queries" className="mt-2 space-y-2">
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
                <PresetButton
                  title="Sleep deprevation"
                  description="Either based on general knowledge or the sources linked."
                  className="bg-slate-100"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Tabs defaultValue="pages" className="pb-4" onValueChange={setIsActiveTabActive}>
        <TabsList className="flex justify-start space-x-4 border-b border-slate-200 bg-transparent">
          <TabsTrigger
            value="pages"
            className={`linear p-2 text-sm transition-all duration-150 ${
              activeTabActive === "pages"
                ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                : "text-gray-500"
            }`}
          >
            Pages
          </TabsTrigger>
          <TabsTrigger
            value="sources"
            className={`linear p-2 text-sm transition-all duration-150 ${
              activeTabActive === "sources"
                ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                : "text-gray-500"
            }`}
          >
            Sources
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className={`linear p-2 text-sm transition-all duration-150 ${
              activeTabActive === "team"
                ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                : "text-gray-500"
            }`}
          >
            Team
          </TabsTrigger>
        </TabsList>

        {/* Activity Content */}
        <TabsContent value="pages" className="py-4 text-sm">
          asdc
        </TabsContent>

        <TabsContent value="sources" className="py-4 text-sm">
          ssadcasd
        </TabsContent>

        <TabsContent value="team" className="py-4 text-sm">
          asdcasdc
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProjectOverView;

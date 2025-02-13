import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { useState } from "react";

import CreateItemModal from "../dialogs/create-item-modal";

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
  const [activeTabActive, setIsActiveTabActive] = useState<string>("pages");
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
            <h1 className="mb-2 text-4xl font-bold">
              Cross regeneration to maximimise macromolecule effusion.
            </h1>
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam autem, deleniti
              ratione fuga consectetur sint unde nostrum, numquam corrupti esse, porro ullam
              dolorum. Repudiandae laborum sit fugit. Ipsum odit mollitia molestiae nobis asperiores
              laborum, modi quos quisquam quibusdam, consectetur nostrum officiis veritatis iure ab
              distinctio, veniam nesciunt voluptas sed! Magnam praesentium id tenetur ducimus error
              magni quidem similique suscipit ad animi consequatur ipsa nobis numquam qui sed ullam
              nulla, voluptatibus iusto eaque accusantium sapiente. Pariatur suscipit quidem
              repellendus maxime modi a quod ipsum quam similique ut nostrum animi odit quibusdam,
              nulla ducimus sapiente quae itaque rerum rem. Doloremque, laborum esse.
            </p>
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
                <div className="w-1/2">
                  <h3 className="text-md mb-2 font-semibold">Get started</h3>
                  <div className="flex flex-col gap-2">
                    <CreateItemModal title={"Create a scientific landscape"} />
                    <CreateItemModal title={"Create a technology overview"} />
                  </div>
                  <br />
                  <div className="flex flex-col gap-2">
                    <PresetButton title="Extract Information" className="bg-slate-100" />
                    <PresetButton title="Extract Patents" className="bg-slate-100" />
                    <PresetButton
                      title="Extract Scientific Publications"
                      className="bg-slate-100"
                    />
                    <PresetButton title="Extract from Scientific Topics" className="bg-slate-100" />
                  </div>
                </div>
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
    </motion.div>
  );
};

export default ProjectOverView;

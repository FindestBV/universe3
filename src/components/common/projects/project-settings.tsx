/**
 * ProjectOverView component provides an overview of project Pages with tab navigation.
 * This is Relevant for Universe Projects/Pages
 *
 * @component
 * @example
 *
 * @returns {JSX.Element} A project overview component with dynamic tab functionality.
 */
import AskIgorModal from "@/components/common/dialogs/ask-igor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { List, ListFilter, Plus, RadarIcon, Star } from "lucide-react";

import { useState } from "react";

import AdvancedSearchModal from "../dialogs/advanced-search-dialog";
import FilterSheet from "../dialogs/filter-sheet";
import MaturityRadar from "./config/maturity-radar";
import RequirementsTable from "./config/requirements-table";
import ResultsOverview from "./config/results-overview";

// Tab type options
type TabOptionType = "technologies" | "results" | "requirements" | "maturity";

// Configuration for each tab type
interface TabTypeConfig {
  id: TabOptionType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const tabTypeOptions: TabTypeConfig[] = [
  {
    id: "technologies",
    label: "List of technologies",
    icon: <List className="h-4 w-4" />,
    description: "Create a comprehensive list of technologies related to your project.",
  },
  {
    id: "results",
    label: "Results overview table",
    icon: <Star className="h-4 w-4" />,
    description: "Generate a table summarizing key results and findings.",
  },
  {
    id: "requirements",
    label: "Requirements table",
    icon: <ListFilter className="h-4 w-4" />,
    description: "Create a structured table of project requirements.",
  },
  {
    id: "maturity",
    label: "Maturity radar",
    icon: <RadarIcon className="h-4 w-4" />,
    description: "Visualize the maturity levels across different dimensions.",
  },
];

// Tab configuration form component to manage isolated form state
interface TabConfigFormProps {
  selectedTabType: TabTypeConfig;
  onSubmit: (formData: Record<string, string>) => void;
  onCancel: () => void;
}

const TabConfigForm = ({ selectedTabType, onSubmit, onCancel }: TabConfigFormProps) => {
  // Local state for form data, isolated from parent component
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div>
      <DialogHeader className="pb-4">
        <DialogTitle className="flex items-center gap-2 text-lg">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-blue-700">
            {selectedTabType.icon}
          </span>
          <span>Configure {selectedTabType.label}</span>
        </DialogTitle>
        <DialogDescription className="text-sm text-slate-500">
          {selectedTabType.description}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="tabName" className="text-right text-sm font-medium text-slate-700">
            Tab Name
          </Label>
          <Input
            id="tabName"
            placeholder="Enter a name for this tab"
            className="col-span-3 rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm"
            value={formData.tabName || ""}
            onChange={(e) => handleInputChange("tabName", e.target.value)}
          />
        </div>

        {/* Dynamic form fields based on the selected tab type */}
        {selectedTabType.id === "technologies" && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="techKeywords" className="text-right text-sm font-medium text-slate-700">
              Keywords
            </Label>
            <Input
              id="techKeywords"
              placeholder="Enter keywords separated by commas"
              className="col-span-3 rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm"
              value={formData.techKeywords || ""}
              onChange={(e) => handleInputChange("techKeywords", e.target.value)}
            />
          </div>
        )}

        {selectedTabType.id === "results" && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="resultColumns"
              className="text-right text-sm font-medium text-slate-700"
            >
              Columns
            </Label>
            <Input
              id="resultColumns"
              placeholder="Enter column names separated by commas"
              className="col-span-3 rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm"
              value={formData.resultColumns || ""}
              onChange={(e) => handleInputChange("resultColumns", e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          onClick={onCancel}
          className="rounded-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Create Tab
        </button>
      </div>
    </div>
  );
};

export const ProjectSettings = () => {
  const [activeTabActive, setIsActiveTabActive] = useState<string>("general");

  const [tabs, setTabs] = useState([
    { id: "general", label: "General Settings" },
    { id: "user-mgmt", label: "User Management" },
    { id: "delete", label: "Delete project" },
  ]);

  // State for the configuration dialog
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [selectedTabType, setSelectedTabType] = useState<TabTypeConfig | null>(null);

  // Function to open the configuration dialog for a specific tab type
  const openTabConfigDialog = (tabType: TabTypeConfig) => {
    setSelectedTabType(tabType);
    setIsConfigDialogOpen(true);
  };

  // Function to handle configuration form submission
  const handleConfigSubmit = (formData: Record<string, string>) => {
    if (!selectedTabType) return;

    // Create a new tab with the configured options
    const newId = selectedTabType.id + "-" + Date.now();
    const newLabel = formData.tabName || selectedTabType.label;

    setTabs([...tabs, { id: newId, label: newLabel }]);
    setIsActiveTabActive(newId);

    setIsConfigDialogOpen(false);
  };

  // Function to handle dialog cancellation
  const handleDialogCancel = () => {
    setIsConfigDialogOpen(false);
  };

  // Function to rename an existing tab
  const renameTab = (id: string) => {
    const newLabel = window.prompt("Rename this tab:");
    if (!newLabel) return;

    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === id ? { ...tab, label: newLabel } : tab)),
    );
  };

  // Configuration Dialog Component
  const TabConfigurationDialog = () => {
    if (!selectedTabType) return null;

    // If the selected type is "requirements", render the RequirementsTable component
    if (selectedTabType.id === "requirements") {
      return (
        <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
          <DialogContent className="flex h-screen max-h-full w-screen max-w-full flex-col border-0 bg-transparent p-0 shadow-none">
            <RequirementsTable
              isOpen={isConfigDialogOpen}
              onClose={() => setIsConfigDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      );
    }

    if (selectedTabType.id === "maturity") {
      return (
        <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
          <DialogContent className="flex h-screen max-h-full w-screen max-w-full flex-col border-0 bg-transparent p-0 shadow-none">
            <MaturityRadar
              isOpen={isConfigDialogOpen}
              onClose={() => setIsConfigDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      );
    }

    if (selectedTabType.id === "results") {
      return (
        <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
          <DialogContent className="flex h-screen max-h-full w-screen max-w-full flex-col border-0 bg-transparent p-0 shadow-none">
            <ResultsOverview
              isOpen={isConfigDialogOpen}
              onClose={() => setIsConfigDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      );
    }

    // For other tab types, render the regular TabConfigForm
    return (
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="flex min-h-[60vh] flex-col border-0 bg-transparent p-0 shadow-none sm:max-w-[500px]">
          <TabConfigForm
            selectedTabType={selectedTabType}
            onSubmit={handleConfigSubmit}
            onCancel={handleDialogCancel}
          />
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="min-h-full" id="projects-pages">
        <div className="mx-auto w-full p-8">
          <div className="overviewHeader flex justify-between">
            <h1 className="mb-2 text-2xl font-bold">Project Setttings</h1>
          </div>
          <div className="mt-0">
            <Tabs defaultValue="general" className="pb-4" onValueChange={setIsActiveTabActive}>
              <TabsList className="flex w-full items-center justify-between border-b border-slate-300 bg-transparent">
                <div className="flex gap-2">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={`px-4 py-2 text-sm transition-all duration-150 ${activeTabActive === tab.id ? "border-b-2 border-blue-800 bg-blue-50 font-bold" : "text-black"}`}
                      onDoubleClick={() => renameTab(tab.id)}
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </div>
              </TabsList>

              {/* Content sections for each tab */}
              <div className="mt-4">
                {tabs.map((tab) => (
                  <TabsContent
                    key={tab.id}
                    value={tab.id}
                    className="mt-2 space-y-2 transition-all duration-150"
                  >
                    {tab.id === "general" && (
                      <div className="w-1/2">
                        <div className="flex flex-col gap-3">
                          <h3 className="text-sm font-bold">Name of the project</h3>
                          <Input
                            type="text"
                            // value={inputValue}
                            // onChange={handleInputChange}
                            placeholder="Enter the name of the project here..."
                            className="bg-[#fcfafc]"
                          />
                          <h3 className="text-sm font-bold">Short description (optional)</h3>

                          <Textarea
                            // onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Type your description here..."
                            className="min-h-[120px] resize-none bg-white pr-12 focus:outline-none focus-visible:ring-offset-0"
                          />
                          <button
                            type="submit"
                            className="max-w-[150px] rounded-md bg-black p-2 text-sm text-white hover:bg-slate-500 focus:outline-none"
                            // onClick={() => setIsDialogOpen(false)}
                          >
                            Save changes
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Content for studies tab */}
                    {tab.id === "user-mgmt" && (
                      <div className="w-full">
                        <div className="flex flex-col">
                          <h3 className="py-2 text-sm font-bold">Owner</h3>
                          {[1].map((_, index) => (
                            <div key={index} className="itemCard items-center">
                              <div className="innerCardMain bg-white">
                                <button
                                  type="button"
                                  role="checkbox"
                                  aria-checked="false"
                                  data-state="unchecked"
                                  value="on"
                                  className="innerCardCheckbox peer h-4 w-4 shrink-0 items-center rounded-sm border border-secondary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                  id={`card-${index}`}
                                ></button>
                                <div className="innerCardContent">
                                  <div className="innerCardContent__Detail">
                                    <div className="flex flex-row items-center gap-4">
                                      <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                      </Avatar>
                                      <h3 className="text-md overflow-hidden text-ellipsis py-0 font-bold text-black">
                                        Ronan O'Leary
                                      </h3>
                                      <div>
                                        <p className="!important text-xs"></p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-row items-start gap-2">
                                    <div className="flex flex-row items-center gap-4">
                                      <div className="time">Feb 12, 12:04</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          <h3 className="py-2 text-sm font-bold">Contributors</h3>
                          {[1, 2, 3, 4].map((_, index) => (
                            <div key={index} className="itemCard items-center">
                              <div className="innerCardMain items-center bg-white">
                                <button
                                  type="button"
                                  role="checkbox"
                                  aria-checked="false"
                                  data-state="unchecked"
                                  value="on"
                                  className="innerCardCheckbox peer h-4 w-4 shrink-0 rounded-sm border border-secondary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                  id={`card-${index}`}
                                ></button>
                                <div className="innerCardContent">
                                  <div className="innerCardContent__Detail">
                                    <div className="flex flex-row items-center gap-4">
                                      <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                      </Avatar>
                                      <h3 className="text-md overflow-hidden text-ellipsis py-0 font-bold text-black">
                                        Sander Van Der Woude
                                      </h3>
                                      <div>
                                        <p className="!important text-xs"></p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-row items-center gap-4">
                                    <div className="time">Feb 12, 12:04</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Content for entities tab */}
                    {tab.id === "delete" && (
                      <div className="w-1/2">
                        <div className="flex flex-col gap-3">
                          <h3 className="text-sm font-bold">Deleting the project</h3>
                          <p className="text-sm">
                            To delete the project, write DELETE in the input and click the delete
                            button. This will irreversibly delete the project and all its pagaes and
                            sources from your universe.{" "}
                          </p>
                          <p className="text-sm">
                            Make sure that you mive anything that you want to keep to your Universe.
                          </p>

                          <Input type="text" className="bg-[#fcfafc]" />

                          <button
                            type="submit"
                            className="text-md max-w-[150px] rounded-md bg-red-600 p-2 text-white hover:bg-red-400 focus:outline-none"
                            // onClick={() => setIsDialogOpen(false)}
                          >
                            Delete Project
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Content for dynamically added tabs */}
                    {!["general", "user-mgmt", "delete"].includes(tab.id) && (
                      <div className="w-full">
                        <div className="overviewHeader py-4">
                          <h1 className="mb-2 text-4xl font-bold">{tab.label}</h1>
                          <p className="mb-4 text-sm">
                            Content for {tab.label} will be displayed here.
                          </p>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Render the configuration dialog */}
      <TabConfigurationDialog />
    </motion.div>
  );
};

export default ProjectSettings;

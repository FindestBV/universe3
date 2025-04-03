/**
 * @file ProjectOverView Component
 * @description A project overview component with dynamic tab functionality.
 * @returns {JSX.Element} A project overview component with dynamic tab functionality.
 */
import { useGetLinkingQuery, useGetMyRecentActivityQuery } from "@/api/activity/activityApi";
import { useGetStudyByIdQuery } from "@/api/documents/documentApi";
import ConnectQuery from "@/components/common/dialogs/connect-query";
import CreateItemModal from "@/components/common/dialogs/create-item-dialog";
import CreateProjectDialog from "@/components/common/dialogs/create-project-dialog";
import { DevBanner } from "@/components/common/layout/dev-banner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// import MaturityRadar from "./config/maturity-radar";
// import RequirementsTable from "./config/requirements-table";
// import ResultsOverview from "./config/results-overview";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigateWithTransition } from "@/hooks/use-navigate-with-transition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { ChevronRight, Hand, List, ListFilter, Loader, Plus, RadarIcon, Star } from "lucide-react";
import { useFeature } from "use-feature";

import { useCallback, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import VotingCard from "../cards/voting-card";
import AskIgorModal from "../dialogs/ask-igor";
import ForceDirectedGraphView from "../layout/force-directed-graph";
import MaturityRadar from "./config/maturity-radar";
import RequirementsTable from "./config/requirements-table";
import ResultsOverview from "./config/results-overview";

// Define the props type for AskIgorModal
declare module "../dialogs/ask-igor" {
  export interface AskIgorModalProps {
    iconOnly?: boolean;
    isToolbar?: boolean;
    label?: string;
  }

  export const AskIgorModal: React.FC<AskIgorModalProps>;
}

// Define the activity data type
interface ActivityData {
  id: string;
  type: string;
  title: string;
  name: string;
  // Add other properties as needed
}

/* Reusable Activity Item Component */
const ActivityItem = ({ title }: { title: string }) => (
  <div className="mb-2 flex w-full cursor-pointer flex-row items-center justify-between rounded-md bg-white p-4 hover:bg-gray-200">
    <div className="flex flex-col">
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>
    <ChevronRight className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-blue-100" />
  </div>
);

const dummyData = [
  {
    customTypeName: null,
    dateAdded: "2022-11-07T09:15:31.335927",
    id: "1",
    lowerLevelNodes: [
      {
        customTypeName: null,
        dateAdded: "2022-11-07T09:15:31.335927",
        id: "2",
        lowerLevelNodes: [{ id: 4 }, { id: 5 }],
        name: "Child A",
        objectType: 1,
        otherUpperLevelNodes: [],
        type: "Technology",
      },
      {
        customTypeName: null,
        dateAdded: "2022-11-07T09:15:31.335927",
        id: "3",
        lowerLevelNodes: [],
        name: "Child B",
        objectType: 1,
        otherUpperLevelNodes: [],
        type: "Technology",
      },
    ],
    name: "Root",
    objectType: 1,
    otherUpperLevelNodes: [],
    type: "Technology",
  },
  {
    customTypeName: null,
    dateAdded: "2022-11-07T09:15:31.335927",
    id: "2",
    lowerLevelNodes: [
      {
        customTypeName: null,
        dateAdded: "2022-11-07T09:15:31.335927",
        id: "4",
        lowerLevelNodes: [],
        name: "Leaf A1",
        objectType: 1,
        otherUpperLevelNodes: [],
        type: "Technology",
      },
      {
        customTypeName: null,
        dateAdded: "2022-11-07T09:15:31.335927",
        id: "5",
        lowerLevelNodes: [],
        name: "Leaf A2",
        objectType: 1,
        otherUpperLevelNodes: [],
        type: "Technology",
      },
    ],
    name: "Child A",
    objectType: 1,
    otherUpperLevelNodes: [],
    type: "Technology",
  },
  {
    customTypeName: null,
    dateAdded: "2022-11-07T09:15:31.335927",
    id: "3",
    lowerLevelNodes: [],
    name: "Child B",
    objectType: 1,
    otherUpperLevelNodes: [],
    type: "Technology",
  },
  {
    customTypeName: null,
    dateAdded: "2022-11-07T09:15:31.335927",
    id: "4",
    lowerLevelNodes: [],
    name: "Leaf A1",
    objectType: 1,
    otherUpperLevelNodes: [],
    type: "Technology",
  },
  {
    customTypeName: null,
    dateAdded: "2022-11-07T09:15:31.335927",
    id: "5",
    lowerLevelNodes: [],
    name: "Leaf A2",
    objectType: 1,
    otherUpperLevelNodes: [],
    type: "Technology",
  },
];

export const Flag = () => {
  const flag = import.meta.env.VITE_POWER_USER_ONLY_FLAG;
  const mast = import.meta.env.VITE_MY_FEATURE;
  // console.log('mast', mast);
  const showFeature = useFeature(flag, mast); // either pass a boolean as a second value or set an environment variable `MY_FEATURE=true`

  console.log("flag", flag);
  return showFeature ? (
    <div className="h-auto w-full bg-blue-100 px-8 py-2 font-bold">{flag}</div>
  ) : null;
};

/**
 * PresetButton component renders a button with a title and description.
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

type FormData = {
  tabName: string;
  technologyDescription: string;
};

const TabConfigForm = ({ selectedTabType, onSubmit, onCancel }: TabConfigFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    tabName: "",
    technologyDescription: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="flex flex-col rounded-lg bg-white p-6">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-lg font-semibold">Configure {selectedTabType.label}</h2>
      </div>
      <div className="grid gap-4 py-4">
        <div className="flex items-center gap-4">
          <Input
            id="tabName"
            placeholder="Enter a name for this tab"
            className="col-span-3 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm"
            value={formData.tabName || ""}
            onChange={(e) => handleInputChange("tabName", e.target.value)}
          />
        </div>
        {/* Additional fields based on selected tab type */}
        {selectedTabType.id === "technologies" && (
          <div className="flex items-center gap-4">
            <Input
              id="technologyDescription"
              placeholder="Enter a description for the technology"
              className="col-span-3 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm"
              value={formData.technologyDescription || ""}
              onChange={(e) => handleInputChange("technologyDescription", e.target.value)}
            />
          </div>
        )}
        {/* Add more fields for other tab types as needed */}
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Create Tab
        </Button>
      </div>
    </div>
  );
};

export const ProjectOverView = () => {
  const { id } = useParams<{ id: string }>();
  const [tabs, setTabs] = useState([
    { id: "overview", label: "Overview" },
    { id: "technologies", label: "Technologies" },
    // { id: "queries", label: "Queries" },
  ]);

  const [activeTabActive, setIsActiveTabActive] = useState<string>("overview");
  const [activeSubTabActive, setIsActiveSubTabActive] = useState<string>("pages");
  const location = useLocation();
  const currentPath = location.pathname;
  const navigateWithTransition = useNavigateWithTransition();

  const { data: activityData, isLoading: activityDataIsLoading } = useGetMyRecentActivityQuery();
  const { data: linkingData } = useGetLinkingQuery();
  const { data: pageData } = useGetStudyByIdQuery(id);
  const isProjectsDashboard = currentPath.includes("/projects/dashboard");
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [selectedTabType, setSelectedTabType] = useState<TabTypeConfig | null>(null);

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

  // Function to navigate to entities with view transitions - optimized with useCallback
  const handleNavigateToEntities = useCallback(
    (type: string, id: string) => {
      // Determine the route based on the entity type
      let route = "/projects";

      // You can customize this logic based on your application's routing structure
      switch (type.toLowerCase()) {
        case "entity":
          route = `/pages/entities/${id}`;
          break;
        case "study":
          route = `/pages/studies/${id}`;
          break;
        case "project":
          route = `/projects/${id}`;
          break;
        case "source":
          route = `/sources/${id}`;
          break;
        default:
          route = `/projects/${id}`;
      }

      // Navigate with view transitions for a smooth experience
      navigateWithTransition(route);
    },
    [navigateWithTransition],
  );

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
        <DialogContent className="bg-white sm:max-w-[500px]">
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
      <div className="projects-overview min-h-full w-full" id="projects-overview">
        {isProjectsDashboard && <DevBanner />}
        {/* 
        <Flag /> */}
        <button
          onClick={() => {
            throw new Error("This is your first error!");
          }}
        >
          Break the world
        </button>
        <div className="mx-auto w-full p-8">
          <Tabs
            defaultValue="overview"
            className="w-full pb-4"
            onValueChange={setIsActiveTabActive}
          >
            <TabsList className="flex w-full items-center justify-between border-b border-slate-300 bg-transparent">
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`p-2 text-sm transition-all duration-150 ${activeTabActive === tab.id ? "border-b-2 border-blue-800 bg-blue-100 font-bold" : "text-black"}`}
                    onDoubleClick={() => renameTab(tab.id)} // Double-click to rename
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </div>
              <div className="addTabTrigger hover:bg-blue-100 active:bg-black">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="flex items-center gap-1 rounded bg-slate-200 p-2 text-sm text-black transition-colors duration-150 hover:border-black hover:bg-black hover:text-white"
                        id="addNewTabButton"
                        onClick={() => {
                          setSelectedTabType(tabTypeOptions[0]); // Set a default tab type or modify as needed
                          setIsConfigDialogOpen(true); // Open the configuration dialog
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="w-72 p-0" align="end">
                      <div className="flex flex-col rounded-md border border-slate-200 bg-white shadow-md">
                        <div className="p-2 text-sm font-bold text-slate-700">Add new tab with</div>
                        <div className="flex flex-col p-1">
                          {tabTypeOptions.map((option) => (
                            <button
                              key={option.id}
                              className="group flex items-center gap-2 rounded-md p-2 text-left text-sm text-slate-700 hover:bg-black hover:text-white"
                              onClick={() => {
                                setSelectedTabType(option); // Set the selected tab type
                                setIsConfigDialogOpen(true); // Open the configuration dialog
                              }}
                            >
                              <span className="flex h-6 w-6 items-center justify-center rounded-md fill-current text-black group-hover:text-white">
                                {option.icon}
                              </span>
                              <span>{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TabsList>

            <TabsContent value="overview" className="mt-2 space-y-2 transition-all duration-150">
              <>
                <div className="flex items-start gap-2">
                  <div className="w-1/2">
                    <div className="overviewHeader py-4">
                      <h1 className="mb-4 max-w-2xl text-4xl font-bold">
                        {isProjectsDashboard ? "Your Universe Projects" : pageData?.title}
                      </h1>

                      {!isProjectsDashboard && (
                        <div className="flex items-center gap-12 py-8">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold">Owner</h4>
                            <Avatar>
                              <AvatarImage src="https://github.com/shadcn.png" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold">Contributors</h4>
                            <Avatar>
                              <AvatarImage src="https://github.com/shadcn.png" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Avatar>
                              <AvatarImage src="https://github.com/shadcn.png" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Avatar>
                              <AvatarImage src="https://github.com/shadcn.png" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Avatar>
                              <AvatarImage src="https://github.com/shadcn.png" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="hoveborder flex items-center gap-2 rounded-full bg-gray-100 p-3">
                              <Plus className="h-5 w-5" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {!isProjectsDashboard ? (
                      <>
                        <p className="text-md mb-4">
                          {pageData?.description
                            ? pageData.title
                            : `Cross regeneration is a sophisticated technique employed to <br />
                          enhance the elution of macromolecules during the production process of
                          specialized ion exchange resins, specifically fro 'Gent production'...`}
                        </p>
                        <div className="flex gap-2">
                          <AskIgorModal />
                          <button
                            className="flex items-center gap-2 rounded border border-slate-300 bg-slate-100 px-4 py-1 font-bold text-black transition-colors duration-200 hover:bg-slate-200"
                            onClick={() => navigateWithTransition("/projects/dashboard")}
                          >
                            <Hand className="h-4 w-4" /> Easy Flows
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col gap-2">
                          <CreateProjectDialog title={"Create a scientific landscape"} />
                          <CreateItemModal title={"Create a technology overview"} />
                        </div>
                      </>
                    )}
                    <div className="recent_projects">
                      <h3 className="title">Recent pages</h3>
                      <div className="projects_container">
                        {activityDataIsLoading ? (
                          <div className="activity_loader">
                            <Loader className="animate-spin text-gray-600" />
                            <p className="loadingText">Loading Activity Data...</p>
                          </div>
                        ) : (
                          activityData?.slice(0, 3).map((activity: ActivityData) => (
                            <div
                              key={activity.id}
                              className="activity_list"
                              onClick={() => handleNavigateToEntities(activity.type, activity.id)}
                            >
                              <div className="item">
                                <h3 className="text-sm font-semibold">
                                  {activity.name && activity?.name.length > 80
                                    ? `${activity.name.slice(0, 80)}...`
                                    : activity.name}
                                </h3>
                              </div>
                              <ChevronRight className="icon" />
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Recent Activity Tabs */}
                    <div className="mt-6">
                      <h3 className="text-md my-2 font-semibold">Recent activity</h3>
                      <Tabs
                        defaultValue="pages"
                        className="pb-4"
                        onValueChange={setIsActiveSubTabActive}
                      >
                        <TabsList className="flex justify-start space-x-4 border-b border-slate-200 bg-transparent">
                          <TabsTrigger
                            value="pages"
                            className={`linear px-4 py-2 text-sm transition-all duration-150 ${
                              activeSubTabActive === "pages"
                                ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                                : "text-gray-500"
                            }`}
                          >
                            Pages
                          </TabsTrigger>
                          <TabsTrigger
                            value="sources"
                            className={`linear px-4 py-2 text-sm transition-all duration-150 ${
                              activeSubTabActive === "sources"
                                ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                                : "text-gray-500"
                            }`}
                          >
                            Sources
                          </TabsTrigger>
                          <TabsTrigger
                            value="team"
                            className={`linear px-4 py-2 text-sm transition-all duration-150 ${
                              activeSubTabActive === "team"
                                ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                                : "text-gray-500"
                            }`}
                          >
                            Team
                          </TabsTrigger>
                        </TabsList>

                        {/* Activity Content */}
                        <TabsContent value="pages" className="py-4 text-sm">
                          <ActivityItem title="Alternatives to PPE" />
                          <ActivityItem title="Cross regeneration to maximimise macromolecule effusion." />
                          <ActivityItem title="Get Weld Soon" />
                        </TabsContent>

                        <TabsContent value="sources" className="py-4 text-sm">
                          <ActivityItem title="Activity 3" />
                          <ActivityItem title="Activity 4" />
                        </TabsContent>

                        <TabsContent value="team" className="py-4 text-sm">
                          <ActivityItem title="Team 1" />
                        </TabsContent>
                      </Tabs>
                    </div>

                    {/* <br />
                    <div className="flex flex-col gap-2">
                      {dialogs.map((d) => (
                        <ProjectSearchDialog key={d.id} dialogTitle={d.title} />
                      ))}
                    </div> */}
                  </div>

                  <div className="h-[800px] w-1/2">
                    <h3 className="text-md mb-2 pt-3 font-semibold">Pages graph</h3>

                    <ForceDirectedGraphView
                      linkingData={linkingData}
                      id="overviewForceDirectedGraph"
                    />
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
                <div className="flex w-full justify-between py-2 font-semibold">
                  <div className="flex items-center">
                    <div className="w-auto min-w-[200px]">Rating</div>
                    <div className="flex-grow">Page Titles</div>
                  </div>
                  <AskIgorModal iconOnly />
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

      {/* Render the configuration dialog */}
      <TabConfigurationDialog />
    </motion.div>
  );
};

export default ProjectOverView;

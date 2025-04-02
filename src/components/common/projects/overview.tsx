/**
 * @file ProjectOverView Component
 * @description A project overview component with dynamic tab functionality.
 * @returns {JSX.Element} A project overview component with dynamic tab functionality.
 */
import { useGetLinkingQuery, useGetMyRecentActivityQuery } from "@/api/activity/activityApi";
import {
  useGetEntitiesQuery,
  useGetEntityByIdQuery,
  useGetStudyByIdQuery,
} from "@/api/documents/documentApi";
import {
  useGetProjectRecentActivitiesQuery,
  useUpdateProjectMutation,
  useUpdateTabContentMutation,
} from "@/api/projects/projectApi";
import { setRecentActivities } from "@/api/projects/projectSlice";
import ConnectQuery from "@/components/common/dialogs/connect-query";
import CreateItemModal from "@/components/common/dialogs/create-item-dialog";
import CreateProjectDialog from "@/components/common/dialogs/create-project-dialog";
import { EditorHeader } from "@/components/common/editor/BlockEditor/components/EditorHeader";
import { ContentItemMenu } from "@/components/common/editor/menus/ContentItemMenu";
import { LinkMenu } from "@/components/common/editor/menus/LinkMenu";
import { TextMenu } from "@/components/common/editor/menus/TextMenu";
import { SimpleEditor } from "@/components/common/editor/SimpleEditor/SimpleEditor";
import { DevBanner } from "@/components/common/layout/dev-banner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigateWithTransition } from "@/hooks/use-navigate-with-transition";
import { useAppDispatch, useAppSelector } from "@/store";
import { faPenToSquare } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Hand,
  List,
  ListFilter,
  Loader,
  Plus,
  RadarIcon,
  Search,
  Smile,
  Star,
  Telescope,
  Waves,
} from "lucide-react";
import { useFeature } from "use-feature";

import { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
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
type TabOptionType =
  | "OVERVIEW"
  | "TECHNOLOGY_LIST"
  | "RESULT_OVERVIEW_TABLE"
  | "REQUIREMENTS_TABLE"
  | "MATURITY_RADAR";

// Configuration for each tab type
interface TabTypeConfig {
  id: TabOptionType;
  label: string;
  icon: React.ReactNode;
  description: string;
  type?: string;
}

const tabTypeOptions: TabTypeConfig[] = [
  {
    id: "OVERVIEW",
    label: "Overview",
    icon: <List className="h-4 w-4" />,
    description: "Project overview and general information.",
  },
  {
    id: "TECHNOLOGY_LIST",
    label: "List of technologies",
    icon: <List className="h-4 w-4" />,
    description: "Create a comprehensive list of technologies related to your project.",
  },
  {
    id: "RESULT_OVERVIEW_TABLE",
    label: "Results overview table",
    icon: <Star className="h-4 w-4" />,
    description: "Generate a table summarizing key results and findings.",
  },
  {
    id: "REQUIREMENTS_TABLE",
    label: "Requirements table",
    icon: <ListFilter className="h-4 w-4" />,
    description: "Create a structured table of project requirements.",
  },
  {
    id: "MATURITY_RADAR",
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
        {selectedTabType.id === "TECHNOLOGY_LIST" && (
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

        {selectedTabType.id === "RESULT_OVERVIEW_TABLE" && (
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

        {selectedTabType.id === "REQUIREMENTS_TABLE" && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="reqCategories"
              className="text-right text-sm font-medium text-slate-700"
            >
              Categories
            </Label>
            <Input
              id="reqCategories"
              placeholder="Enter requirement categories"
              className="col-span-3 rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm"
              value={formData.reqCategories || ""}
              onChange={(e) => handleInputChange("reqCategories", e.target.value)}
            />
          </div>
        )}

        {selectedTabType.id === "MATURITY_RADAR" && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="maturityDimensions"
              className="text-right text-sm font-medium text-slate-700"
            >
              Dimensions
            </Label>
            <Input
              id="maturityDimensions"
              placeholder="Enter maturity dimensions"
              className="col-span-3 rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm"
              value={formData.maturityDimensions || ""}
              onChange={(e) => handleInputChange("maturityDimensions", e.target.value)}
            />
          </div>
        )}
      </div>

      <DialogFooter className="flex justify-end gap-2 border-t border-slate-200 pt-4">
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
      </DialogFooter>
    </div>
  );
};

export const ProjectOverView = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [updateTabContent] = useUpdateTabContentMutation();

  // Get project data from Redux store
  const { currentProject, pages, tabs, activeTabId, isLoading, error, recentActivities } =
    useAppSelector((state) => state.project);

  // Fetch recent activities
  const { data: projectRecentActivities, isLoading: activitiesLoading } =
    useGetProjectRecentActivitiesQuery(id || "");

  useEffect(() => {
    if (projectRecentActivities) {
      dispatch(setRecentActivities(projectRecentActivities));
    }
  }, [projectRecentActivities]);

  // Sort tabs by order and find default tab
  const sortedTabs = [...(tabs || [])].sort((a, b) => a.order - b.order);
  const defaultTab = sortedTabs.find((tab) => tab.isDefault)?.id || sortedTabs[0]?.id || "OVERVIEW";
  const [activeTabActive, setIsActiveTabActive] = useState<string>(defaultTab);
  const [activeSubTabActive, setIsActiveSubTabActive] = useState<string>("pages");
  const location = useLocation();
  const currentPath = location.pathname;
  const navigateWithTransition = useNavigateWithTransition();
  const { data: linkingData } = useGetLinkingQuery();

  const isProjectsDashboard = currentPath.includes("/projects/dashboard");

  // State for the configuration dialog
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [selectedTabType, setSelectedTabType] = useState<TabTypeConfig | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

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

    // setTabs([...tabs, { id: newId, label: newLabel }]);
    setIsActiveTabActive(newId);

    // Here you would send the configuration data to the backend
    // Example: sendConfigToBackend(newId, selectedTabType.id, formData);

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

    // setTabs((prevTabs) =>
    //   prevTabs.map((tab) => (tab.id === id ? { ...tab, label: newLabel } : tab)),
    // );
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

    // If the selected type is "REQUIREMENTS_TABLE", render the RequirementsTable component
    if (selectedTabType.type === "REQUIREMENTS_TABLE") {
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

    if (selectedTabType.type === "MATURITY_RADAR") {
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

    if (selectedTabType.type === "RESULT_OVERVIEW_TABLE") {
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
      <div className="projects-overview min-h-full w-full" id="projects-overview">
        {isProjectsDashboard && <DevBanner />}
        {/* 
        <Flag /> */}
        <div className="mx-auto w-full p-8">
          <Tabs
            defaultValue={defaultTab}
            value={activeTabActive}
            className="w-full pb-4"
            onValueChange={setIsActiveTabActive}
          >
            <TabsList className="flex w-full items-center justify-between border-b border-slate-300 bg-transparent">
              <div className="flex gap-2">
                {sortedTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`p-2 text-sm transition-all duration-150 ${activeTabActive === tab.id ? "border-b-2 border-blue-800 bg-blue-100 font-bold" : "text-black"}`}
                    onDoubleClick={() => renameTab(tab.id)}
                  >
                    {tab.name}
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>

            {/* Content sections for each tab */}
            {sortedTabs.map((tab) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="mt-2 space-y-2 transition-all duration-150"
              >
                {tab.type === "OVERVIEW" && (
                  // Overview tab content
                  <>
                    <div className="flex items-start gap-2">
                      <div className="w-1/2">
                        <div className="overviewHeader py-4">
                          <h1 className="mb-4 max-w-2xl text-4xl font-bold">
                            {isProjectsDashboard ? "Your Universe Projects" : currentProject?.name}
                          </h1>

                          {!isProjectsDashboard && (
                            <div className="flex items-center gap-12">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold">Owner</h4>
                                <Avatar>
                                  <AvatarImage src="https://github.com/shadcn.png" />
                                  <AvatarFallback>
                                    {currentProject?.owner?.email.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                            </div>
                          )}
                        </div>

                        {!isProjectsDashboard ? (
                          <>
                            <div className="relative" ref={menuContainerRef}>
                              <div className="blockEditor_mainContent flex rounded-md">
                                <div
                                  className={`mainEditor h-full w-full rounded-md ${isEditing ? "prose-editor bg-white shadow-md" : ""}`}
                                >
                                  <SimpleEditor
                                    content={currentProject?.tabs[0]?.content || null}
                                    editable={isEditing}
                                    documentId={id}
                                    onUpdate={(json) => {
                                      if (currentProject?.tabs[0]) {
                                        updateTabContent({
                                          projectId: currentProject.id,
                                          tabId: currentProject.tabs[0].id,
                                          content: JSON.stringify(json),
                                        });
                                        console.log("Editor content updated:", json);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
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
                            </TabsList>

                            {/* Activity Content */}
                            <TabsContent value="pages" className="py-4 text-sm">
                              {activitiesLoading ? (
                                <div className="flex items-center justify-center py-4">
                                  <Loader className="h-6 w-6 animate-spin text-gray-600" />
                                </div>
                              ) : recentActivities?.recentPages?.length ? (
                                recentActivities.recentPages.map((page) => (
                                  <div
                                    key={page.id}
                                    onClick={() => handleNavigateToEntities(page.type, page.id)}
                                    className="mb-2 flex w-full cursor-pointer flex-row items-center justify-between rounded-md bg-white p-4 hover:bg-gray-200"
                                  >
                                    <div className="flex flex-col">
                                      <h3 className="text-sm font-semibold">{page.title}</h3>
                                    </div>
                                    <ChevronRight className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-blue-200" />
                                  </div>
                                ))
                              ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                  <p className="text-gray-500">No recent pages found</p>
                                  <div className="mt-4 flex w-full max-w-md gap-2">
                                    <button className="h-8 flex-1 rounded bg-[#0A0C12] px-4 text-sm font-medium text-white hover:bg-black">
                                      Create new page
                                    </button>
                                    <button
                                      onClick={() =>
                                        navigateWithTransition(`/projects/${id}/search`)
                                      }
                                      className="h-8 flex-1 rounded bg-[#DDD7CE] px-4 text-sm font-medium text-black hover:bg-gray-200"
                                    >
                                      Add existing page
                                    </button>
                                  </div>
                                </div>
                              )}
                            </TabsContent>

                            <TabsContent value="sources" className="py-4 text-sm">
                              {activitiesLoading ? (
                                <div className="flex items-center justify-center py-4">
                                  <Loader className="h-6 w-6 animate-spin text-gray-600" />
                                </div>
                              ) : recentActivities?.recentSavedSources?.length ? (
                                recentActivities.recentSavedSources.map((source) => (
                                  <div
                                    key={source.id}
                                    onClick={() => handleNavigateToEntities("source", source.id)}
                                    className="mb-2 flex w-full cursor-pointer flex-row items-center justify-between rounded-md bg-white p-4 hover:bg-gray-200"
                                  >
                                    <div className="flex flex-col">
                                      <h3 className="text-sm font-semibold">{source.title}</h3>
                                    </div>
                                    <ChevronRight className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-blue-200" />
                                  </div>
                                ))
                              ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                  <p className="text-gray-500">No recent sources found</p>
                                  <div className="mt-4 flex w-full max-w-md">
                                    <button
                                      onClick={() =>
                                        navigateWithTransition(`/projects/${id}/search`)
                                      }
                                      className="h-8 w-full rounded bg-[#0A0C12] px-4 text-sm font-medium text-white hover:bg-black"
                                    >
                                      Find external sources
                                    </button>
                                  </div>
                                </div>
                              )}
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
                          linkingData={linkingData?.items || []}
                          id="overviewForceDirectedGraph"
                        />
                      </div>
                    </div>
                  </>
                )}

                {tab.id === "TECHNOLOGY_LIST" && (
                  <div className="flex w-full flex-col">
                    {/* Header Row */}
                    <div className="mb-2 flex w-full px-4 py-2 font-semibold">
                      <div className="w-auto min-w-[200px]">Rating</div>
                      <div className="flex-grow">Page Titles</div>
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
                )}

                {tab.id === "RESULT_OVERVIEW_TABLE" && (
                  <ResultsOverview isOpen={true} onClose={() => {}} />
                )}

                {tab.id === "REQUIREMENTS_TABLE" && (
                  <RequirementsTable isOpen={true} onClose={() => {}} />
                )}

                {tab.id === "MATURITY_RADAR" && <MaturityRadar isOpen={true} onClose={() => {}} />}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Render the configuration dialog */}
      <TabConfigurationDialog />
    </motion.div>
  );
};

export default ProjectOverView;

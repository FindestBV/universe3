/**
 * ProjectOverView component provides an overview of project Pages with tab navigation.
 * This is Relevant for Universe Projects/Pages
 *
 * @component
 * @example
 *
 * @returns {JSX.Element} A project overview component with dynamic tab functionality.
 */
import { useGetProjectPagesQuery } from "@/api/projects/projectApi";
import { setError, setLoading, setPages } from "@/api/projects/projectSlice";
import AskIgorModal from "@/components/common/dialogs/ask-igor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigateWithTransition } from "@/hooks/use-navigate-with-transition";
import { useAppDispatch, useAppSelector } from "@/store";
import type { PageListItem } from "@/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { Filter, List, ListFilter, Plus, RadarIcon, Star } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useEffect, useState } from "react";

import AdvancedSearchModal from "../dialogs/advanced-search-dialog";
import FilterOptions from "../layout/filter-options";
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
        <DialogTitle className="flex items-center gap-2 text-sm">
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

export type ProjectPagesProps = {
  projectId: string;
};

export const ProjectPages = ({ projectId }: ProjectPagesProps) => {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const itemsPerPage = 20;

  const { data: pagesData, isLoading } = useGetProjectPagesQuery({
    projectId,
    skip: (currentPage - 1) * itemsPerPage,
    limit: itemsPerPage,
  });

  // Update Redux store when data changes
  useEffect(() => {
    if (pagesData?.items) {
      dispatch(setPages(pagesData.items));
      dispatch(setLoading(false));
    }
  }, [pagesData, dispatch]);

  // Handle error state
  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
    }
  }, [isLoading, dispatch]);

  const navigateWithTransition = useNavigateWithTransition();
  const [activeTabActive, setIsActiveTabActive] = useState<string>("all");
  const [isSideBarToggled, setIsSideBarToggled] = useState<boolean>(false);
  const [filterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

  const [tabs, setTabs] = useState([
    { id: "all", label: "All Page Types" },
    { id: "STUDY", label: "Studies" },
    { id: "ENTITY", label: "Entities" },
  ]);

  // State for the configuration dialog
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [selectedTabType, setSelectedTabType] = useState<TabTypeConfig | null>(null);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

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

  // Checkbox Selects

  const handleSelectDoc = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedDocs);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedDocs(newSelected);
  };

  const handleSelectItem = (id: string, event: React.ChangeEvent<HTMLInputElement> | boolean) => {
    if (typeof event === "boolean") {
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        if (event) {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
        return newSet;
      });
    } else {
      event.stopPropagation(); // Prevent navigation when clicking checkbox
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    }
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

  // Add this helper function near the top of the file, after imports
  const filterPagesByType = (pages: PageListItem[] | undefined, type: string | null) => {
    if (!pages || !type || type === "all") return pages;
    return pages.filter((page) => page.type.toUpperCase() === type.toUpperCase());
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (pagesData && !pagesData.isLastPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Add a handler for select all
  const handleSelectAll = () => {
    if (pagesData?.items) {
      if (selectedItems.size === pagesData.items.length) {
        // If all items are selected, unselect all
        setSelectedItems(new Set());
      } else {
        // Otherwise, select all items
        setSelectedItems(new Set(pagesData.items.map((item) => item.id)));
      }
    }
  };

  // Inside the ProjectPages component
  const renderPagination = () => {
    if (!pagesData?.items || pagesData.items.length === 0) {
      return null;
    }

    const pageNumber = currentPage;

    return (
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={selectedItems.size > 0}
            className="ml-4 h-4 w-4"
            onCheckedChange={handleSelectAll}
          />
          <Label htmlFor="select-all" className="text-md">
            Select all
          </Label>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600">
            {itemsPerPage * (currentPage - 1) + 1} -{" "}
            {Math.min(itemsPerPage * currentPage, pagesData.totalItemCount)} of{" "}
            {pagesData.totalItemCount}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`rounded-md p-1 ${
                currentPage === 1
                  ? "cursor-not-allowed text-slate-300"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={pagesData.isLastPage}
              className={`rounded-md p-1 ${
                pagesData.isLastPage
                  ? "cursor-not-allowed text-slate-300"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleNavigateToPage = (page: PageListItem) => {
    const route =
      page.type.toLowerCase() === "entity"
        ? `/pages/entities/${page.id}`
        : `/pages/studies/${page.id}`;
    navigateWithTransition(route);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="flex min-h-full" id="projects-pages">
        <div
          className={`${isSideBarToggled ? "w-3/4" : "w-full"} h-full p-8 transition-all duration-150 ease-in-out`}
        >
          <div className="overviewHeader flex justify-between">
            <h1 className="mb-2 text-2xl font-bold">Pages</h1>

            <div className="project-controls flex items-center gap-2">
              <AdvancedSearchModal />
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="flex items-center gap-1 rounded bg-slate-200 p-2 text-sm text-black transition-colors duration-150 hover:border-black hover:bg-black hover:text-white"
                        id="addNewTabButton"
                      >
                        <Plus className="h-4 w-4" /> Add page
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
              <Button
                onClick={() => {
                  setIsSideBarToggled((prevState) => !prevState);
                  setIsFilterOpen((prevState) => !prevState);
                }}
                className={`group ${filterOpen ? "bg-black" : "bg-slate-200"} hover:bg-black`}
              >
                <Filter
                  className={`text-${filterOpen ? "white" : "black"} h-4 w-4 group-hover:stroke-white ${isSideBarToggled && "fill-black"}`}
                />
              </Button>

              <AskIgorModal iconOnly />
            </div>
          </div>

          <div className="mt-0">
            <Tabs
              value={activeTabActive}
              defaultValue="all"
              className="pb-4"
              onValueChange={setIsActiveTabActive}
            >
              <TabsList className="flex w-full items-center justify-between border-b border-slate-300 bg-transparent">
                <div className="flex gap-2">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={`px-4 py-2 text-sm transition-all duration-150 ${
                        activeTabActive === tab.id
                          ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                          : "text-black"
                      }`}
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
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-sm text-slate-600">Loading...</div>
                      </div>
                    ) : (
                      <>
                        {/* Add pagination at the top of content */}
                        {pagesData?.items && pagesData.items.length > 0 && renderPagination()}

                        <div className="w-full">
                          <div className="flex flex-col">
                            {pagesData?.items
                              .filter((page) => (tab.id === "all" ? true : tab.id === page.type))
                              .map((page) => (
                                <div key={page.id} className="itemCard">
                                  <div className="innerCardMain bg-white">
                                    <Checkbox
                                      id={`card-${page.id}`}
                                      checked={selectedItems.has(page.id)}
                                      onCheckedChange={(checked) =>
                                        handleSelectItem(page.id, checked as boolean)
                                      }
                                      className="innerCardCheckbox"
                                    />
                                    <div className="innerCardContent">
                                      <div className="innerCardContent__Detail">
                                        <div className="flex flex-col">
                                          <h3 className="text-md overflow-hidden text-ellipsis py-0 text-sm font-bold text-black">
                                            {page.title}
                                          </h3>
                                        </div>
                                        <div className="innerCardContent__Links">
                                          <ul className="linkedCounts flex flex-wrap gap-2">
                                            <li className="linkedCounts__item documentCount">
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-book-open-check"
                                              >
                                                <path d="M12 21V7"></path>
                                                <path d="m16 12 2 2 4-4"></path>
                                                <path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"></path>
                                              </svg>
                                              {page.linkedCounts.documentCount}
                                            </li>
                                            <li className="linkedCounts__item studyCount">
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-book-open-check"
                                              >
                                                <path d="M12 21V7"></path>
                                                <path d="m16 12 2 2 4-4"></path>
                                                <path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"></path>
                                              </svg>
                                              {page.linkedCounts.studyCount}
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <div className="flex flex-row items-start gap-2">
                                        <div className="flex flex-row items-center gap-4">
                                          <div className="time">{formatDate(page.dateAdded)}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </>
                    )}
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>
        </div>
        <div
          className={`${isSideBarToggled ? "right-0 flex min-h-screen w-1/4 flex-col justify-between p-4" : "hidden w-0 p-0"} bg-slate-150 top-4 transition-all duration-150 ease-in-out`}
        >
          <FilterOptions />
        </div>
      </div>
    </motion.div>
  );
};
export default ProjectPages;

import { useGetStudyByIdQuery } from "@/api/documents/documentApi";
import { CreateProjectDialog } from "@/components/common/dialogs/create-project-dialog";
import ProjectOverView from "@/components/common/projects/overview";
import ProjectPages from "@/components/common/projects/pages";
import ProjectSettings from "@/components/common/projects/project-settings";
import ProjectSearch from "@/components/common/projects/search";
import ProjectSources from "@/components/common/projects/sources";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigateWithTransition } from "@/hooks/use-navigate-with-transition";
import { RootState } from "@/store";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Eye,
  File,
  Home,
  Link,
  Network,
  Pin,
  Plus,
  Search,
  SearchIcon,
  Settings,
  Telescope,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import NestedMenu from "../editor/BlockEditor/components/NestedMenu";

export const Dashboard = ({
  type,
  id,
  content,
  title,
  connectedDocs,
  connectedInbox,
  connectedObjects,
  connectedQueries,
  connectedComments,
  connectedEntities,
}: {
  type?: string;
  id?: string;
  content?: string;
  title?: string;
  connectedDocs?: string;
  connectedInbox?: string;
  connectedObjects?: string;
  connectedQueries?: string;
  connectedComments?: string;
  connectedStudies?: string;
  connectedEntities?: string;
}) => {
  // const { id } = useParams<{ id: string }>();
  const menuContainerRef = useRef(null);
  const [isTitleExpanded, setIsTitleExpanded] = useState<boolean>(false);
  const navigateWithTransition = useNavigateWithTransition();

  const isEditing = useSelector((state: RootState) => state.document.isEditing);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [currentView, setCurrentView] = useState<string>("overview");
  const { data: pageData } = useGetStudyByIdQuery(id);

  const location = useLocation();
  const currentPath = location.pathname;

  const isProjectDashboard = currentPath.includes("dashboard");

  const toggleSection = (sectionTitle: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const triggerExpand = () => {
    setIsTitleExpanded(!isTitleExpanded);
    // console.log(isTitleExpanded ? "expanded" : "normal");
  };

  const projectStructure = [
    {
      title: "Description",
      references: ["Reference 1", "Reference 2"],
    },
    {
      title: "Images",
      references: ["Image 1", "Image 2", "Image 3"],
    },
    {
      title: "Suppliers",
      references: ["Supplier A", "Supplier B"],
    },
  ];

  useEffect(() => {}, [currentView]);

  return (
    <div className="flex" ref={menuContainerRef}>
      <div className="relative flex h-full max-w-full flex-1 flex-col">
        <div className="flex flex-row overflow-hidden">
          <div className={`z-[10] hidden md:flex`}>
            <div className="flex h-screen w-full flex-col border-r border-gray-200 md:w-80">
              <div className="fixed top-0 flex h-screen w-80 flex-col border-r border-gray-200 bg-white">
                <div className="flex flex-col">
                  {/* Gradient Header */}
                  <div
                    className={`flex transform-gpu cursor-pointer transition-all duration-300 ease-in-out ${
                      isTitleExpanded ? "w-[200%]" : "w-full"
                    } justify-between bg-[linear-gradient(to_bottom_right,black_0%,black_70%,#60a5fa_80%,white_90%,#facc15_100%)] p-4`}
                  >
                    <div className="flex flex-col">
                      <small className="text-xs font-bold text-white">Project</small>
                      <p className="text-xs font-bold text-white">
                        {isProjectDashboard ? "Your Universe Projects" : pageData?.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Eye
                        size={20}
                        className={`transform-gpu cursor-pointer transition-colors duration-300 ${
                          isTitleExpanded ? "text-[#FFFF00]" : "text-white"
                        }`}
                        onClick={triggerExpand}
                      />
                      <ChevronsUpDown size={20} className="text-white" />
                    </div>
                  </div>

                  {/* Expandable Content */}
                  <div
                    className={`transform-gpu overflow-hidden bg-white transition-all duration-300 ease-in-out ${
                      isTitleExpanded ? "h-[250px] w-[200%] opacity-100" : "h-0 w-full opacity-0"
                    } rounded-br-lg border shadow-md`}
                  >
                    <div
                      className={`transition-transform duration-300 ${
                        isTitleExpanded ? "translate-y-0" : "-translate-y-4"
                      }`}
                    >
                      <ul className="border-b border-gray-200">
                        <li className="flex w-full items-center gap-2 p-4 transition-colors duration-200 hover:bg-blue-100">
                          <span className="text-sm font-semibold text-gray-600">
                            Alternative to PFTE
                          </span>
                          <span className="ml-auto flex gap-2">
                            <Eye className="rounded p-1 text-gray-600 transition-colors duration-200 hover:bg-blue-200" />
                            <ChevronRight className="rounded bg-gray-100 p-1 text-gray-600 transition-colors duration-200 hover:bg-blue-200" />
                          </span>
                        </li>
                        <li className="flex w-full items-center gap-2 p-4 transition-colors duration-200 hover:bg-blue-100">
                          <span className="text-sm font-semibold text-gray-600">
                            Cross regeneration to maximise macromolecules elution for 'Gent
                            production' ion gas resins
                          </span>
                          <span className="ml-auto flex gap-2">
                            <Eye className="rounded p-1 text-gray-600 transition-colors duration-200 hover:bg-blue-200" />
                            <ChevronRight className="rounded bg-gray-100 p-1 text-gray-600 transition-colors duration-200 hover:bg-blue-200" />
                          </span>
                        </li>
                        <li className="flex w-full items-center gap-2 p-4 transition-colors duration-200 hover:bg-blue-100">
                          <span className="text-sm font-semibold text-gray-600">Get Weld Soon</span>
                          <span className="ml-auto flex gap-2">
                            <Eye className="rounded p-1 text-gray-600 transition-colors duration-200 hover:bg-blue-200" />
                            <ChevronRight className="rounded bg-gray-100 p-1 text-gray-600 transition-colors duration-200 hover:bg-blue-200" />
                          </span>
                        </li>
                      </ul>
                      <div className="flex w-full gap-1 border p-2">
                        <button
                          className="flex items-center gap-2 rounded border border-slate-300 bg-slate-100 px-4 py-2 text-black transition-colors duration-200 hover:bg-slate-200"
                          onClick={() => navigateWithTransition("/projects/dashboard")}
                        >
                          <ArrowLeft /> Back to the Universe
                        </button>
                        <CreateProjectDialog type="findest-button" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto">
                  <nav className="border-b border-gray-200">
                    <div className="flex justify-between">
                      <div
                        className={`${currentView === "overview" && "bg-black text-white"} group m-2 flex w-full items-center justify-between gap-2 rounded-sm px-4 py-2 transition-all duration-150 ease-linear hover:bg-black`}
                        onClick={() => {
                          setCurrentView("overview");
                        }}
                      >
                        <div className="flex w-3/4 gap-2">
                          <Home className="h-5 w-5 group-hover:text-white" />
                          <span
                            className={`text-sm font-medium ${currentView === "overview" ? "text-white" : "text-gray-600"} group-hover:text-white`}
                          >
                            Project overview
                          </span>
                        </div>
                      </div>
                      <div className="flex w-1/4 items-center gap-2">
                        <span className="ml-2 p-1">
                          {currentView === "overview" ? (
                            <SearchIcon
                              className={`h-6 w-6 rounded-sm p-1 group-hover:text-white`}
                            />
                          ) : (
                            <SearchIcon
                              className={`p-1 ${
                                currentView === "overview"
                                  ? "text-gray-100"
                                  : "font-bold text-gray-600"
                              } rounded-sm group-hover:bg-blue-500 group-hover:text-white`}
                            />
                          )}
                        </span>
                      </div>
                    </div>
                    {/* <li
                      className={`${currentView === "search" && "bg-gray-200"} m-4 flex max-w-full items-center gap-2 rounded-full border bg-gray-200 p-2 transition-all duration-150 ease-linear`}
                      onClick={() => setCurrentView("search")}
                    >
                      <Search className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">Search</span>
                      <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-300 text-xs font-black text-blue-600">
                        3
                      </div>
                    </li> */}
                    <div
                      className={`${currentView === "pages" && "bg-black text-white"} group m-2 flex max-w-full items-center gap-2 rounded-sm px-4 py-2 transition-all duration-150 ease-linear hover:bg-black`}
                      onClick={() => setCurrentView("pages")}
                    >
                      <File className="h-5 w-5 group-hover:text-white" />
                      <span
                        className={`text-sm font-medium ${currentView === "pages" ? "text-white" : "text-gray-600"} group-hover:text-white`}
                      >
                        Project pages
                      </span>
                      <span className="ml-auto flex self-center">
                        {currentView === "pages" ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Plus
                                  className={`rounded-sm bg-blue-500 p-1 text-white group-hover:text-white`}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <a href="/pages/studies/08dd3f81-c24e-44e5-89ba-107467de54d9">
                                  <p className="text-xs">Create page</p>
                                </a>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <a href="/projects/create-page">
                                  <Plus
                                    className={`p-1 ${
                                      currentView === "pages"
                                        ? "text-white"
                                        : "bg-gray-100 text-gray-600"
                                    } rounded-sm group-hover:bg-blue-500 group-hover:text-white`}
                                  />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p className="text-xs">Create page</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </span>
                    </div>
                    <div
                      className={`${currentView === "sources" && "bg-black text-white"} group m-2 flex max-w-full items-center gap-2 rounded-sm px-4 py-2 transition-all duration-150 ease-linear hover:bg-gray-200 hover:text-gray-500`}
                      onClick={() => setCurrentView("sources")}
                    >
                      <Link className="h-5 w-5 group-hover:text-white" />
                      <span
                        className={`text-sm font-medium ${currentView === "sources" ? "text-white" : "text-gray-600"} group-hover:text-gray-600`}
                      >
                        Project sources
                      </span>
                      <span className="ml-auto flex self-center">
                        {currentView === "sources" ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <a href="/pages/studies/08dd3f81-c24e-44e5-89ba-107467de54d9">
                                  <Plus
                                    className={`rounded-sm p-1 text-white hover:bg-blue-500 group-hover:bg-blue-500`}
                                  />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p className="text-xs">Create source</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <a href="/pages/studies/08dd3f81-c24e-44e5-89ba-107467de54d9">
                                  <Plus
                                    className={`p-1 ${
                                      currentView === "sources"
                                        ? "text-white"
                                        : "bg-gray-100 text-gray-600"
                                    } rounded-sm bg-gray-100 p-1 group-hover:text-blue-500 group-active:text-blue-500`}
                                  />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p className="text-xs">Create source</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </span>
                    </div>
                    <div
                      className={`${currentView === "find" && "bg-black text-white"} group m-2 flex max-w-full items-center gap-2 rounded-sm px-4 py-2 transition-all duration-150 ease-linear hover:bg-black`}
                      onClick={() => setCurrentView("find")}
                    >
                      <Telescope className="h-5 w-5 group-hover:text-white" />
                      <span
                        className={`text-sm font-medium ${currentView === "find" ? "text-white" : "text-gray-600"} group-hover:text-white`}
                      >
                        Find
                      </span>
                      <span className="ml-auto">
                        {currentView === "find" ? (
                          <Plus
                            className={`rounded-sm bg-blue-500 p-1 text-white group-hover:text-white`}
                          />
                        ) : (
                          <Plus
                            className={`p-1 ${
                              currentView === "find" ? "text-white" : "bg-gray-100 text-gray-600"
                            } rounded-sm group-hover:bg-blue-500 group-hover:text-white`}
                          />
                        )}
                      </span>
                    </div>
                  </nav>

                  {/* Table of Contents */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="mb-4 transform-none text-xs font-bold tracking-tight">
                        Project structure
                      </h3>
                      <div>
                        <span className="ml-auto flex items-center gap-2">
                          <Network className="rounded-sm bg-gray-100 p-1 text-gray-600 hover:bg-gray-200" />
                          <Plus className="rounded-sm bg-gray-100 p-1 text-gray-600 hover:bg-gray-200" />
                        </span>
                      </div>
                    </div>
                    <NestedMenu />
                    <nav className="space-y-2">
                      <ul className="refs">
                        {projectStructure.map((section) => (
                          <li key={section.title}>
                            <button
                              onClick={() => toggleSection(section.title)}
                              className="flex max-w-full items-center gap-2 rounded-md py-2 text-left text-sm font-medium text-gray-700"
                            >
                              {openSections[section.title] ? (
                                <ChevronDown className="rounded-sm bg-gray-100 p-1 text-gray-500" />
                              ) : (
                                <ChevronRight className="rounded-sm bg-gray-100 p-1 text-gray-500" />
                              )}
                              {section.title}
                              <Pin className="p-1 text-gray-500" fill="#000000" />
                            </button>
                            {openSections[section.title] && (
                              <ul className="ml-4 mt-2 space-y-1 border-l-2 border-gray-300 pl-3">
                                {section.references.map((ref, index) => (
                                  <li
                                    key={index}
                                    className="text-sm text-gray-500 hover:text-gray-800"
                                  >
                                    {ref}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </div>

                <div
                  className={`${currentView === "settings" && "bg-black text-white"} group m-2 flex max-w-full items-center gap-2 rounded-sm px-4 py-2 transition-all duration-150 ease-linear hover:bg-black`}
                  onClick={() => setCurrentView("settings")}
                >
                  <Settings className="h-5 w-5 group-hover:text-white" />
                  <span
                    className={`text-sm font-medium ${currentView === "settings" ? "text-white" : "text-gray-600"} group-hover:text-white`}
                  >
                    Project settings
                  </span>
                  {/* <span className="ml-auto">
                        {currentView === "settings" ? (
                          <ChevronRight
                            className={`rounded-sm p-1 text-white group-hover:text-white`}
                          />
                        ) : (
                          <Plus
                            className={`p-1 ${
                              currentView === "settings" ? "text-white" : "bg-gray-100 text-gray-600"
                            } rounded-sm group-hover:bg-transparent group-hover:text-white`}
                          />
                        )}
                      </span> */}
                </div>
                {/* Settings Footer */}
              </div>
            </div>
          </div>
          <div className="w-full rounded-md bg-[#F2F4F8]">
            <div
              className={`mainEditor h-full w-full rounded-md bg-[#F2F4F8] ${isEditing ? "prose-editor" : ""}`}
              id="mainEditorStart"
            >
              {currentView === "overview" ? (
                <div>
                  <ProjectOverView />
                </div>
              ) : // ) : currentView === "search" ? (
              //   <div>
              //     <ProjectSearch />
              //   </div>
              currentView === "pages" ? (
                <div>
                  <ProjectPages />
                </div>
              ) : currentView === "find" ? (
                <div>
                  <ProjectSearch />
                </div>
              ) : currentView === "settings" ? (
                <div>
                  <ProjectSettings />
                </div>
              ) : (
                <div>
                  <ProjectSources />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

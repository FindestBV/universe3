import { useGetStudyByIdQuery } from "@/api/documents/documentApi";
import { CreateProjectDialog } from "@/components/common/dialogs/create-project-dialog";
import ProjectFinder from "@/components/common/projects/find";
import ProjectOverView from "@/components/common/projects/overview";
import ProjectPages from "@/components/common/projects/pages";
import ProjectSettings from "@/components/common/projects/project-settings";
import ProjectSearch from "@/components/common/projects/search";
import ProjectSources from "@/components/common/projects/sources";
import { useNavigateWithTransition } from "@/hooks/use-navigate-with-transition";
import { useAppSelector } from "@/store";
import type { RootState } from "@/store";
import type { Project } from "@/types/types";
import {
  ArrowLeft,
  ChevronRight,
  ChevronsUpDown,
  Eye,
  File,
  Home,
  Link,
  Network,
  Plus,
  Settings,
  Telescope,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import NestedMenu from "../editor/BlockEditor/components/NestedMenu";

export const Dashboard = () => {
  const { id } = useParams<{ id: string }>();
  const menuContainerRef = useRef(null);
  const [isTitleExpanded, setIsTitleExpanded] = useState<boolean>(false);
  const navigateWithTransition = useNavigateWithTransition();

  const project = useAppSelector((state: RootState) => state.project);
  const { recentProjects } = useAppSelector((state: RootState) => state.project);

  const isEditing = useSelector((state: RootState) => state.document.isEditing);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [currentView, setCurrentView] = useState<string>("overview");

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
  };

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
                        {isProjectDashboard
                          ? "Your Universe Projects"
                          : project.currentProject?.name}
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
                      isTitleExpanded
                        ? "h-auto max-h-[19rem] w-[200%] opacity-100"
                        : "h-0 w-full opacity-0"
                    } rounded-br-lg border shadow-md`}
                  >
                    <div
                      className={`flex h-full flex-col justify-between transition-transform duration-300 ${
                        isTitleExpanded ? "translate-y-0" : "-translate-y-4"
                      }`}
                    >
                      {/* Recent Projects List */}
                      {recentProjects?.length > 0 && (
                        <ul className="flex-1 overflow-y-auto border-b border-gray-200">
                          {recentProjects
                            .filter((project: Project) => project.id !== id) // Exclude current project
                            .slice(0, 3) // Show maximum 3 items
                            .map((project: Project) => (
                              <li
                                key={project.id}
                                onClick={() => navigateWithTransition(`/projects/${project.id}`)}
                                className="flex h-16 w-full cursor-pointer items-center gap-2 p-4 transition-colors duration-200 hover:bg-blue-100"
                              >
                                <span className="truncate text-sm font-semibold text-gray-600">
                                  {project.name}
                                </span>
                                <span className="ml-auto flex shrink-0 gap-2">
                                  <Eye className="rounded p-1 text-gray-600 transition-colors duration-200 hover:bg-blue-200" />
                                  <ChevronRight className="rounded bg-gray-100 p-1 text-gray-600 transition-colors duration-200 hover:bg-blue-200" />
                                </span>
                              </li>
                            ))}
                        </ul>
                      )}
                      <div className="flex w-full gap-1 border-t p-2">
                        <button
                          className="flex items-center gap-2 rounded-sm px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                          onClick={() => navigateWithTransition("/projects/dashboard")}
                        >
                          <ArrowLeft className="h-4 w-4" /> Back to the Universe
                        </button>
                        <CreateProjectDialog type="findest-button" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto">
                  <ul className="border-b border-gray-200">
                    <li
                      className={`${currentView === "overview" && "bg-black text-white"} group m-2 flex max-w-full items-center gap-2 rounded-sm px-4 py-2 transition-all duration-150 ease-linear hover:bg-black`}
                      onClick={() => setCurrentView("overview")}
                    >
                      <Home className="h-5 w-5 group-hover:text-white" />
                      <span
                        className={`text-sm font-medium ${currentView === "overview" ? "text-white" : "text-gray-600"} group-hover:text-white`}
                      >
                        Project overview
                      </span>
                    </li>
                    <li
                      className={`${currentView === "pages" && "bg-black text-white"} group m-2 flex max-w-full items-center gap-2 rounded-sm px-4 py-2 transition-all duration-150 ease-linear hover:bg-black`}
                      onClick={() => setCurrentView("pages")}
                    >
                      <File className="h-5 w-5 group-hover:text-white" />
                      <span
                        className={`text-sm font-medium ${currentView === "pages" ? "text-white" : "text-gray-600"} group-hover:text-white`}
                      >
                        Project pages
                      </span>
                      <span className="ml-auto">
                        {currentView === "pages" ? (
                          <ChevronRight
                            className={`rounded-sm p-1 text-white group-hover:text-white`}
                          />
                        ) : (
                          <Plus
                            className={`p-1 ${
                              currentView === "pages" ? "text-white" : "bg-gray-100 text-gray-600"
                            } rounded-sm group-hover:bg-transparent group-hover:text-white`}
                          />
                        )}
                      </span>
                    </li>
                    <li
                      className={`${currentView === "sources" && "bg-black text-white"} group m-2 flex max-w-full items-center gap-2 rounded-sm px-4 py-2 transition-all duration-150 ease-linear hover:bg-black`}
                      onClick={() => setCurrentView("sources")}
                    >
                      <Link className="h-5 w-5 group-hover:text-white" />
                      <span
                        className={`text-sm font-medium ${currentView === "sources" ? "text-white" : "text-gray-600"} group-hover:text-white`}
                      >
                        Project sources
                      </span>
                      <span className="ml-auto">
                        {currentView === "sources" ? (
                          <ChevronRight
                            className={`rounded-sm p-1 text-white group-hover:text-white`}
                          />
                        ) : (
                          <Plus
                            className={`p-1 ${
                              currentView === "sources" ? "text-white" : "bg-gray-100 text-gray-600"
                            } rounded-sm group-hover:bg-transparent group-hover:text-white`}
                          />
                        )}
                      </span>
                    </li>
                    <li
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
                          <ChevronRight
                            className={`rounded-sm p-1 text-white group-hover:text-white`}
                          />
                        ) : (
                          <Plus
                            className={`p-1 ${
                              currentView === "find" ? "text-white" : "bg-gray-100 text-gray-600"
                            } rounded-sm group-hover:bg-transparent group-hover:text-white`}
                          />
                        )}
                      </span>
                    </li>
                  </ul>

                  {/* Project Structure Section */}
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
                    <NestedMenu projectStructure={project.currentProject?.projectStructure} />
                    <nav className="space-y-2">
                      <ul className="refs" />
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
                </div>
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
              ) : currentView === "pages" ? (
                <div>
                  <ProjectPages projectId={id || ""} />
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

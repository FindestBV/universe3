// import { useCreateDraftMutation, useUpdateDraftMutation } from "@/api/documents/documentApi";
// import ConnectQuery from "@/components/common/dialogs/connect-query";
// import { SimilarDocumentModal } from "@/components/common/dialogs/similar-document-modal";
// import Comments from "@/components/common/layout/comments";
// import { TOCSidebar } from "./components/TOCSidebar";
import { CreateProjectDialog } from "@/components/common/dialogs/create-project-dialog";
import ProjectOverView from "@/components/common/projects/overview";
import ProjectPages from "@/components/common/projects/pages";
import ProjectSearch from "@/components/common/projects/search";
import ProjectSources from "@/components/common/projects/sources";
import { Button } from "@/components/ui/button";
// import { SearchForm } from "@/components/common/sidebar/search-form";
// import ImageBlockMenu from "@/extensions/ImageBlock/components/ImageBlockMenu";
// import { ColumnsMenu } from "@/extensions/MultiColumn/menus";
// import { TableColumnMenu, TableRowMenu } from "@/extensions/Table/menus";
// import { useDashboard } from "@/hooks/use-block-editor";
import { useNavigateWithTransition } from "@/hooks/use-navigate-with-transition";
// import { initialContent } from "@/lib/data/initialContent";
import { RootState } from "@/store";
// import { EditorContent } from "@tiptap/react";
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
  Settings,
} from "lucide-react";

import { Key, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const menuContainerRef = useRef(null);
  const [isTitleExpanded, setIsTitleExpanded] = useState<boolean>(false);
  const navigateWithTransition = useNavigateWithTransition();

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
                    className={`flex transition-all duration-150 ease-linear ${isTitleExpanded ? "w-[200%]" : "w-full"} justify-between bg-[linear-gradient(to_bottom_right,black_0%,black_70%,#60a5fa_80%,white_90%,#facc15_100%)] p-4`}
                  >
                    <>
                      <div className="flex flex-col">
                        <small className="text-xs font-bold text-white">Project</small>
                        <p className="text-xs font-bold text-white">
                          {isProjectDashboard
                            ? "Your Universe Projects"
                            : "Cross regeneration to maxim..."}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Eye
                          size={20}
                          className={`cursor-pointer ${isTitleExpanded ? "text-[#FFFF00]" : "text-white"}`}
                          onClick={triggerExpand}
                        />
                        <ChevronsUpDown size={20} className="text-white" />
                      </div>
                    </>
                  </div>
                  <div
                    className={`bg-white transition-all duration-150 ease-linear ${isTitleExpanded ? "h-auto w-[200%] rounded-br-lg border shadow-md" : "hidden h-0 w-full"}`}
                  >
                    <ul className="border-b border-gray-200">
                      <li className="flex w-full items-center gap-2 p-4 hover:bg-blue-100">
                        <span className="text-sm font-semibold text-gray-600">
                          Alternative to PFTE
                        </span>
                        <span className="ml-auto flex gap-2">
                          <Eye className="rounded p-1 text-gray-600 hover:bg-blue-200" />
                          <ChevronRight className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-blue-200" />
                        </span>
                      </li>
                      <li className="flex w-full items-center gap-2 p-4 hover:bg-blue-100">
                        <span className="text-sm font-semibold text-gray-600">
                          Cross regeneration to maximise macromolecules elution for 'Gent
                          production' ion gas resins
                        </span>
                        <span className="ml-auto flex gap-2">
                          <Eye className="rounded p-1 text-gray-600 hover:bg-blue-200" />
                          <ChevronRight className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-blue-200" />
                        </span>
                      </li>
                      <li className="flex w-full items-center gap-2 p-4 hover:bg-blue-100">
                        <span className="text-sm font-semibold text-gray-600">Get Weld Soon</span>
                        <span className="ml-auto flex gap-2">
                          <Eye className="rounded p-1 text-gray-600 hover:bg-blue-200" />
                          <ChevronRight className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-blue-200" />
                        </span>
                      </li>
                    </ul>
                    <div className="flex w-full gap-1 border p-2">
                      <Button
                        className="border border-slate-300 bg-slate-100 text-black hover:bg-slate-200"
                        onClick={() => {
                          navigateWithTransition(`/projects/dashboard`);
                        }}
                      >
                        <ArrowLeft /> Back to the Universe
                      </Button>
                      <CreateProjectDialog type="findest-button" />
                    </div>
                  </div>
                </div>
                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto">
                  <ul className="border-b border-gray-200">
                    <li
                      className={`group m-2 flex max-w-full items-center gap-2 rounded-sm p-4 ${
                        currentView === "overview" ? "bg-black" : "bg-white"
                      } hover:bg-black`}
                      onClick={() => {
                        setCurrentView("overview");
                      }}
                    >
                      <Home
                        className={`h-5 w-5 ${
                          currentView === "overview" ? "text-white" : "text-gray-600"
                        } group-hover:text-white`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          currentView === "overview" ? "text-white" : "text-gray-600"
                        } group-hover:text-white`}
                      >
                        Project overview
                      </span>
                      <span className="ml-auto">
                        <ChevronRight
                          className={`p-1 ${
                            currentView === "overview" ? "text-white" : "bg-gray-100 text-gray-600"
                          } rounded-sm group-hover:bg-transparent group-hover:text-white`}
                        />
                      </span>
                    </li>
                    <li
                      className={`m-4 flex max-w-full items-center gap-2 rounded-full border border-gray-200 p-2 ${
                        currentView === "search" ? "bg-gray-100" : "bg-white"
                      } hover:bg-gray-100`}
                      onClick={() => setCurrentView("search")}
                    >
                      <Search className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">Search</span>
                      <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-300 text-xs font-black text-blue-600">
                        3
                      </div>

                      {/* <span className="ml-auto flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">3</span>
                        <ChevronRight className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-blue-200" />
                      </span> */}
                    </li>
                    <li
                      className={`group m-2 flex max-w-full items-center gap-2 rounded-sm p-4 ${
                        currentView === "pages" ? "bg-black" : "bg-white"
                      } hover:bg-black`}
                      onClick={() => setCurrentView("pages")}
                    >
                      <File
                        className={`h-5 w-5 ${
                          currentView === "pages" ? "text-white" : "text-gray-600"
                        } group-hover:text-white`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          currentView === "pages" ? "text-white" : "text-gray-600"
                        } group-hover:text-white`}
                      >
                        Project pages
                      </span>
                      <span className="ml-auto">
                        <Plus
                          className={`p-1 ${
                            currentView === "pages" ? "text-white" : "bg-gray-100 text-gray-600"
                          } rounded-sm group-hover:bg-transparent group-hover:text-white`}
                        />
                      </span>
                    </li>
                    <li
                      className={`group m-2 flex max-w-full items-center gap-2 rounded-sm p-4 ${
                        currentView === "sources" ? "bg-black" : "bg-white"
                      } hover:bg-black`}
                      onClick={() => setCurrentView("sources")}
                    >
                      <Link
                        className={`h-5 w-5 ${
                          currentView === "sources" ? "text-white" : "text-gray-600"
                        } group-hover:text-white`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          currentView === "sources" ? "text-white" : "text-gray-600"
                        } group-hover:text-white`}
                      >
                        Project sources
                      </span>
                      <span className="ml-auto">
                        <Plus
                          className={`p-1 ${
                            currentView === "sources" ? "text-white" : "bg-gray-100 text-gray-600"
                          } rounded-sm group-hover:bg-transparent group-hover:text-white`}
                        />
                      </span>
                    </li>
                  </ul>

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
                              <Pin className="p-1 text-gray-500" />
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

                {/* Settings Footer */}
                <div className="border-t border-gray-200 bg-white p-4">
                  <div className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                    <Settings className="h-4 w-4" fill="#000000" />
                    <span>Project settings</span>
                  </div>
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
              ) : currentView === "search" ? (
                <div>
                  <ProjectSearch />
                </div>
              ) : currentView === "pages" ? (
                <div>
                  <ProjectPages />
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

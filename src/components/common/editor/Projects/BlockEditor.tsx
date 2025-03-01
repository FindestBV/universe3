import { useCreateDraftMutation, useUpdateDraftMutation } from "@/api/documents/documentApi";
import ConnectQuery from "@/components/common/dialogs/connect-query";
import { SimilarDocumentModal } from "@/components/common/dialogs/similar-document-modal";
import Comments from "@/components/common/layout/comments";
// import { TOCSidebar } from "./components/TOCSidebar";

import ProjectOverView from "@/components/common/projects/overview";
import ProjectPages from "@/components/common/projects/pages";
import ProjectSearch from "@/components/common/projects/search";
import ProjectSources from "@/components/common/projects/sources";
import { SearchForm } from "@/components/common/sidebar/search-form";
import ImageBlockMenu from "@/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/extensions/Table/menus";
import { useBlockEditor } from "@/hooks/use-block-editor";
import { useNavigateWithTransition } from "@/hooks/use-navigate-with-transition";
import { initialContent } from "@/lib/data/initialContent";
import { RootState } from "@/store";
import { EditorContent } from "@tiptap/react";
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

import { CreateProjectDialog } from "../../dialogs/create-project-dialog";
import { Button } from "../ui/Button";

export const BlockEditor = ({
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
  const [isLeftSideBarOpen, setIsLeftSidebarOpen] = useState<boolean>(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isTitleExpanded, setIsTitleExpanded] = useState<boolean>(false);
  const [createDraft] = useCreateDraftMutation();
  const [updateDraft] = useUpdateDraftMutation();
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [lastSavedContent, setLastSavedContent] = useState<string | null>(null); // To track changes
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);
  const navigateWithTransition = useNavigateWithTransition();

  const parsedContent = useMemo(() => {
    try {
      // Parse content if it's a string, otherwise use it as is
      if (typeof content === "string" || typeof content.type === "doc") {
        // console.log(typeof content);
        return JSON.parse(content);
      }
      // Ensure it has the required structure
      if (typeof content === "object") {
        return content;
      }
      // Fallback for invalid content
      return { type: "doc", content: [] };
    } catch (error) {
      // console.error("Error parsing content:", error);
      return { type: "doc", content: initialContent }; // Default fallback
    }
  }, [content]);

  const saveContent = useCallback(
    async (content: any) => {
      if (JSON.stringify(content) === lastSavedContent) {
        // console.log("No changes detected.");
        return;
      }

      try {
        if (currentId) {
          await updateDraft({
            id: currentId,
            content,
          });
        } else {
          const response = await createDraft({ content });
          setCurrentId(response.data.id);
        }
        setLastSavedContent(JSON.stringify(content));
      } catch (error) {
        // console.error("Error saving content:", error);
      }
    },
    [currentId, lastSavedContent, updateDraft, createDraft, content],
  );

  const { editor, collabState, users } = useBlockEditor({
    title,
    content: parsedContent,
    onUpdate({ editor }) {
      const updatedJSON = editor.getJSON();
      saveContent(updatedJSON);
    },
  });

  const isEditing = useSelector((state: RootState) => state.document.isEditing);
  const isLocked = useSelector((state: RootState) => state.document.isLocked);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [currentView, setCurrentView] = useState<View>("overview");
  const [isInnerNavActive, setIsInnerNavActive] = useState<boolean>();

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

  useEffect(() => {
    if (isEditing) {
      autoSaveInterval.current = setInterval(saveContent, 10000); // Save every 10 seconds
    }
    return () => {
      if (autoSaveInterval.current) clearInterval(autoSaveInterval.current);
    };
  }, [isEditing, saveContent]);

  useEffect(() => {
    // console.log("currentView", currentView);
  }, [currentView]);

  if (!editor) {
    return <p>Loading editor...</p>;
  }

  return (
    <div className="flex" ref={menuContainerRef}>
      <div className="relative flex h-full max-w-full flex-1 flex-col">
        <div className="flex flex-row overflow-hidden">
          <div className={`z-[10] hidden md:flex ${isLeftSideBarOpen ? "flex-col" : "collapsed"}`}>
            <div className="flex h-screen w-full flex-col border-r border-gray-200 md:w-80">
              <div className="fixed top-0 flex h-screen w-80 flex-col border-r border-gray-200 bg-white">
                <div className="flex flex-col">
                  {/* Gradient Header */}
                  <div
                    className={`flex transition-all duration-150 ease-linear ${isTitleExpanded ? "w-[200%]" : "w-full"} justify-between bg-[linear-gradient(to_bottom_right,black_0%,black_70%,#60a5fa_80%,white_90%,#facc15_100%)] p-4`}
                  >
                    <>
                      <p className="text-xs font-bold text-white">
                        {isProjectDashboard
                          ? "Your Universe Projects"
                          : "Cross regeneration to maxim..."}
                      </p>
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
                      className={`${currentView === "overview" && "bg-blue-100"} flex w-full items-center gap-2 p-4 hover:bg-blue-100`}
                      onClick={() => {
                        setCurrentView("overview");
                      }}
                    >
                      <Home className="h-5 w-5" />
                      <span className="text-sm font-medium text-gray-600">Project overview</span>
                      <span className="ml-auto">
                        <ChevronRight className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-blue-200" />
                      </span>
                    </li>
                    <li
                      className={`${currentView === "search" && "bg-blue-100"} flex w-full items-center gap-2 p-4 hover:bg-blue-100`}
                      onClick={() => setCurrentView("search")}
                    >
                      <Search className="h-5 w-5" />
                      <span className="text-sm font-medium text-gray-600">Search</span>
                      <span className="ml-auto">
                        <ChevronRight className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-blue-200" />
                      </span>
                    </li>
                    <li
                      className={`${currentView === "pages" && "bg-blue-100"} flex w-full items-center gap-2 p-4 hover:bg-blue-100`}
                      onClick={() => setCurrentView("pages")}
                    >
                      <File className="h-5 w-5" />
                      <span className="text-sm font-medium text-gray-600">Pages</span>
                      <span className="ml-auto">
                        <Plus className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-blue-200" />
                      </span>
                    </li>
                    <li
                      className={`${currentView === "sources" && "bg-blue-100"} flex w-full items-center gap-2 p-4 hover:bg-blue-100`}
                      onClick={() => setCurrentView("sources")}
                    >
                      <Link className="h-5 w-5" />
                      <span className="text-sm font-medium text-gray-600">Sources</span>
                      <span className="ml-auto">
                        <Plus className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-blue-200" />
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
                    <nav className="space-y-2">
                      <ul className="refs">
                        {projectStructure.map((section) => (
                          <li key={section.title}>
                            <button
                              onClick={() => toggleSection(section.title)}
                              className="flex w-full items-center gap-2 rounded-md py-2 text-left text-sm font-medium text-gray-700"
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
                    <Settings className="h-4 w-4" />
                    <span>Project settings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full rounded-md bg-[#fcfcfc] p-4">
            <div
              className={`mainEditor h-full w-full rounded-md bg-white shadow-md ${isEditing ? "prose-editor" : ""}`}
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

export default BlockEditor;

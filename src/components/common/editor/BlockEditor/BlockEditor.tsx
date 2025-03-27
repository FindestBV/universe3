// import { useCreateDraftMutation, useUpdateDraftMutation } from "@/api/documents/documentApi";
import ConnectQuery from "@/components/common/dialogs/connect-query";
import { SimilarDocumentModal } from "@/components/common/dialogs/similar-document-modal";
import Comments from "@/components/common/layout/comments";
import ImageBlockMenu from "@/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/extensions/Table/menus";
import { useBlockEditor } from "@/hooks/use-block-editor";
import { useNavigateWithTransition } from "@/hooks/use-navigate-with-transition";
import { initialContent } from "@/lib/data/initialContent";
import { RootState } from "@/store";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { EditorContent } from "@tiptap/react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Download,
  Eye,
  File,
  Home,
  Link,
  Network,
  Pin,
  Plus,
  SearchIcon,
  Settings,
  Telescope,
} from "lucide-react";
import { Tooltip } from "recharts";

// import * as YProsemirror from "../../../../../../node_modules/y-prosemirror";

import { Key, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import CreateProjectDialog from "../../dialogs/create-project-dialog";
import { LinkMenu } from "../menus";
import { ContentItemMenu } from "../menus/ContentItemMenu";
import { TextMenu } from "../menus/TextMenu";
import { Button } from "../ui/Button";
import { EditorHeader } from "./components/EditorHeader";
import NestedMenu from "./components/NestedMenu";
import ReferencesSidebar from "./components/ReferencesSidebar";

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
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const [isTitleExpanded, setIsTitleExpanded] = useState<boolean>(false);
  // const [createDraft] = useCreateDraftMutation();
  // const [updateDraft] = useUpdateDraftMutation();
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [lastSavedContent, setLastSavedContent] = useState<string | null>(null); // To track changes
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);
  const navigateWithTransition = useNavigateWithTransition();

  console.log("block editor type", type);

  const parsedContent = useMemo(() => {
    try {
      // Handle null/undefined case
      if (!content) {
        return { type: "doc", content: [] };
      }

      // Parse string content (like JSON)
      if (typeof content === "string") {
        return JSON.parse(content);
      }

      // Handle object content
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (typeof content === "object" && content.type === "doc") {
        return content;
      }

      // Fallback for invalid content
      return { type: "doc", content: [] };
    } catch (error) {
      console.error("Error parsing content:", error);
      return { type: "doc", content: initialContent };
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
          // await updateDraft({
          //   id: currentId,
          //   content,
          // });
        }
        setLastSavedContent(JSON.stringify(content));
      } catch (error) {
        console.error("Error saving content:", error);
      }
    },
    [currentId, lastSavedContent, content],
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
  const [activeTab, setActiveTab] = useState("home");

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
      <div className="flex-2 relative flex h-full w-full flex-col">
        <div className="flex flex-row overflow-hidden">
          {/* Begin Aside */}

          <div className={`blockEditor_aside z-[10] hidden md:flex`}>
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
                      <p className="text-xs font-bold text-white">Your Universe Projects</p>
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
                                    } rounded-sm hover:bg-blue-500 group-hover:bg-white`}
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
                      className={`${currentView === "sources" && "text-white"} group m-2 flex max-w-full items-center gap-2 rounded-sm px-4 py-2 transition-all duration-150 ease-linear hover:bg-gray-200 hover:text-gray-500 active:bg-black`}
                      onClick={() => setCurrentView("sources")}
                    >
                      <Link className="h-5 w-5 group-hover:text-gray-600" />
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
                                    className={`rounded-sm bg-gray-100 p-1 text-white hover:bg-blue-500 active:bg-blue-500`}
                                  />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p className="text-xs">Create source</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : null}
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
          <div className="blockEditor_mainContent flex rounded-md bg-[#fcfcfc] px-4">
            <div
              className={`mainEditor h-full w-full rounded-md bg-white shadow-md ${isEditing ? "prose-editor" : ""}`}
              id="mainEditorStart"
            >
              <div className="mx-12 flex flex-col pt-10">
                <EditorHeader
                  editor={editor}
                  collabState={collabState}
                  users={users}
                  documentId={id}
                />
              </div>

              {/* Begin Main */}
              <div className="mx-2 flex flex-col pl-24 pt-10">
                <div className="mx-auto mb-6 w-full py-8">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-slate-600">
                      TECHNOLOGY
                      <ChevronDown />
                    </div>
                  </div>
                  <h1 className="mb-2 text-4xl font-bold">
                    {title
                      ? title
                      : "CN109368873A - 一种风电互补海水淡化系统 <br /> - Google Patents."}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Eye className="h-4 w-4" />
                    <span>2 TIMES CITED BY</span>
                  </div>
                </div>

                {/* Author Info */}
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                    S
                  </div>
                  <div className="flex w-full justify-between text-sm">
                    <div>Created by sander.vanderwoude@findest.eu</div>
                    <div className="mr-32 text-gray-500">26 June 2024</div>
                  </div>
                </div>
              </div>
              <EditorContent key={editor?.view?.id || "editor"} editor={editor} className="" />
              <ContentItemMenu editor={editor} />
              <LinkMenu editor={editor} containerRef={menuContainerRef} />
              <TextMenu editor={editor} />
              <ColumnsMenu editor={editor} containerRef={menuContainerRef} />
              <TableRowMenu editor={editor} containerRef={menuContainerRef} />
              <TableColumnMenu editor={editor} containerRef={menuContainerRef} />
              <ImageBlockMenu editor={editor} containerRef={menuContainerRef} />
              <div className="editorContentContainer" id="linkedDocuments">
                <h3 className="itemTitle flex items-center gap-4">
                  Linked documents <Download size={16} />
                </h3>

                {connectedObjects?.documents && connectedObjects.documents.length > 0
                  ? connectedObjects.documents.map(
                      (doc: { title: Key | null | undefined; id: string }) => (
                        <div key={doc.title}>
                          <SimilarDocumentModal
                            title={doc.title}
                            id={doc.id}
                            type="linkedObjects"
                          />
                        </div>
                      ),
                    )
                  : "no connected objects"}
              </div>
              <div className="editorContentContainer" id="connectedQueries">
                <h3 className="itemTitle">Connected Queries</h3>
                <p className="iconText">Connections:</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {connectedQueries &&
                    (connectedQueries[0]?.connectedObjects &&
                    connectedQueries[0].connectedObjects.length > 0 ? (
                      connectedQueries[0].connectedObjects.map(
                        (obj: {
                          id: Key | null | undefined;
                          name: string;
                          mainContents: unknown;
                          searchInformation: unknown;
                        }) => (
                          <SimilarDocumentModal
                            key={obj.id}
                            id={obj.id}
                            title={obj.name}
                            mainContents={obj.mainContents}
                            searchInformation={obj.searchInformation}
                            type="entity"
                          />
                        ),
                      )
                    ) : (
                      <div className="flex flex-row-reverse items-center gap-4">
                        <Button variant="outline">ADD QUERY</Button>
                        <ConnectQuery
                          attachToItem={function (id: string): void {
                            throw new Error("Function not implemented.");
                          }}
                          parentId={""}
                          parentTitle={""}
                        />
                        <p className="text-gray-500">No connected objects</p>
                      </div>
                    ))}
                </div>
              </div>
              <div className="editorContentContainer" id="connectedComments">
                <Comments connectedComments={connectedComments} />
              </div>
            </div>
            <div className={`referenceSidebar h-full px-4`}>
              <ReferencesSidebar editor={editor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockEditor;

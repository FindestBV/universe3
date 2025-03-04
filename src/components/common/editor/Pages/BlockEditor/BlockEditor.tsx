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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { EditorContent } from "@tiptap/react";
import {
  ChevronDown,
  Download,
  Eye,
  File,
  Home,
  Inbox,
  Paperclip,
  Search,
  Settings,
} from "lucide-react";

import { Key, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { LinkMenu } from "../../menus";
import { ContentItemMenu } from "../../menus/ContentItemMenu";
import { TextMenu } from "../../menus/TextMenu";
import { Button } from "../../ui/Button";
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
      console.error("Error parsing content:", error);
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
                  <div className="flex flex-col">
                    {/* Gradient Header */}
                    <Tabs
                      defaultValue="home"
                      className="mt-4 space-y-1"
                      onValueChange={setActiveTab}
                    >
                      <TabsList className="mx-auto flex w-full justify-between gap-2 px-4">
                        <TabsTrigger
                          value="home"
                          className={activeTab === "home" ? "fill-black" : "text-gray-500"}
                        >
                          <Home size={20} />
                        </TabsTrigger>
                        <TabsTrigger
                          value="search"
                          className={activeTab === "search" ? "fill-black" : "text-gray-500"}
                        >
                          <Search size={20} />
                        </TabsTrigger>
                        <TabsTrigger
                          value="inbox"
                          className={activeTab === "inbox" ? "fill-black" : "text-gray-500"}
                        >
                          <Inbox size={20} />
                        </TabsTrigger>
                        <TabsTrigger
                          value="documents"
                          className={activeTab === "documents" ? "fill-black" : "text-gray-500"}
                        >
                          <File size={20} />
                        </TabsTrigger>
                        <TabsTrigger
                          value="links"
                          className={activeTab === "links" ? "fill-black" : "text-gray-500"}
                        >
                          <Paperclip size={20} />
                        </TabsTrigger>
                      </TabsList>
                      <div className="tabContent h-[90vh] overflow-y-scroll p-2">
                        <TabsContent value="home">
                          <NestedMenu />
                        </TabsContent>
                        <TabsContent value="search" className="mt-2 space-y-2">
                          Search
                        </TabsContent>
                        <TabsContent value="documents" className="mt-2 space-y-2">
                          Documents
                        </TabsContent>
                        <TabsContent value="pages" className="mt-2 space-y-2">
                          Pages
                        </TabsContent>
                        <TabsContent value="links" className="mt-2 space-y-2">
                          Links
                        </TabsContent>
                      </div>
                    </Tabs>
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

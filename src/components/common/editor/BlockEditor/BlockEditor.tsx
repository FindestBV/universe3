import { useCreateDraftMutation, useUpdateDraftMutation } from "@/api/documents/documentApi";
import { SimilarDocumentModal } from "@/components/common/dialogs/similar-document-modal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ImageBlockMenu from "@/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/extensions/Table/menus";
import { useBlockEditor } from "@/hooks/use-block-editor";
import { initialContent } from "@/lib/data/initialContent";
import { RootState } from "@/store";
import { EditorContent } from "@tiptap/react";
import { Download } from "lucide-react";

import { Key, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import ConnectQuery from "../../dialogs/connect-query";
import Comments from "../../layout/comments";
import ReferencesSidebar from "../BlockEditor/components/ReferencesSidebar";
import { LinkMenu } from "../menus";
import { ContentItemMenu } from "../menus/ContentItemMenu";
import { TextMenu } from "../menus/TextMenu";
import { Button } from "../ui/Button";
import { EditorHeader } from "./components/EditorHeader";
import { TOCSidebar } from "./components/TOCSidebar";

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
  const [createDraft] = useCreateDraftMutation();
  const [updateDraft] = useUpdateDraftMutation();
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [lastSavedContent, setLastSavedContent] = useState<string | null>(null); // To track changes
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);

  console.log("block editor type", type);

  const toggleLeftSideBar = () => {
    setIsLeftSidebarOpen(!isLeftSideBarOpen);
  };

  const toggleInnerSidebar = () => {
    console.log(isSidebarCollapsed);
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const parsedContent = useMemo(() => {
    try {
      // Parse content if it's a string, otherwise use it as is
      if (typeof content === "string" || typeof content.type === "doc") {
        console.log(typeof content);
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
        console.log("No changes detected.");
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
        console.error("Error saving content:", error);
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

  // Debugging: Check if `customImage` is in the editor schema
  if (editor) {
    console.log("rendered rtitle", title);
    console.log("schema nodes?", editor.schema.nodes);
    console.log("editor in BlockEditor", editor);
    console.log("editor in BlockEditor", connectedInbox);
  }

  const isEditing = useSelector((state: RootState) => state.document.isEditing);
  const isLocked = useSelector((state: RootState) => state.document.isLocked);

  useEffect(() => {
    if (isEditing) {
      autoSaveInterval.current = setInterval(saveContent, 10000); // Save every 10 seconds
    }
    return () => {
      if (autoSaveInterval.current) clearInterval(autoSaveInterval.current);
    };
  }, [isEditing, saveContent]);

  if (!editor) {
    return <p>Loading editor...</p>;
  }

  return (
    <div className="flex" ref={menuContainerRef}>
      <div className="relative flex h-full max-w-full flex-1 flex-col">
        <div className="flex flex-row overflow-hidden">
          <div className={`${isLeftSideBarOpen ? "flex" : "collapsed"}`}>
            <TOCSidebar
              editor={editor}
              isOpen={isLeftSideBarOpen && !isLocked}
              connectedEntities={connectedInbox}
              title={title}
            />
          </div>
          <div
            className={`mainEditor w-full bg-[#F9FAF9] ${isEditing ? "prose-editor" : ""}`}
            id="mainEditorStart"
          >
            <div className="mx-auto w-full">
              <EditorHeader
                editor={editor}
                collabState={collabState}
                users={users}
                isSidebarOpen={isLeftSideBarOpen}
                toggleLeftSidebar={toggleLeftSideBar}
                documentId={id}
              />
            </div>
            <div className="mx-2 flex flex-col pl-40 pt-10">
              <p className="iconText font-black uppercase">{type ?? type}</p>
            </div>
            <EditorContent
              key={editor?.view?.id || "editor"}
              editor={editor}
              className="flex overflow-y-scroll pb-16 pt-8 md:px-16"
            />
            <ContentItemMenu editor={editor} />
            <LinkMenu editor={editor} appendTo={menuContainerRef} />
            <TextMenu editor={editor} />
            <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
            <TableRowMenu editor={editor} appendTo={menuContainerRef} />
            <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
            <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
            <div className="editorContentContainer" id="linkedDocuments">
              <h3 className="itemTitle flex items-center gap-4">
                Linked documents <Download size={16} />
              </h3>

              {connectedObjects?.documents && connectedObjects.documents.length > 0
                ? connectedObjects.documents.map(
                    (doc: { title: Key | null | undefined; id: string }) => (
                      <div key={doc.title}>
                        <SimilarDocumentModal title={doc.title} id={doc.id} type="linkedObjects" />
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
          {/* <div className={`referenceSidebar ${isSidebarCollapsed || isLocked ? "collapsed" : ""}`}>
            <ReferencesSidebar
              onToggleInnerSidebar={toggleInnerSidebar}
              isCollapsed={isSidebarCollapsed || isLocked}
              connectedEntities={connectedEntities}
              connectedDocs={connectedDocs}
              connectedObjects={connectedObjects}
              connectedInbox={connectedInbox}
              editor={editor}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default BlockEditor;

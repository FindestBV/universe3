import { useCreateDraftMutation, useUpdateDraftMutation } from "@/api/documents/documentApi";
import { SimilarDocumentModal } from "@/components/common/dialogs/similar-document-modal";
import ImageBlockMenu from "@/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/extensions/Table/menus";
import { useBlockEditor } from "@/hooks/use-block-editor";
import { Mark } from "@tiptap/core";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import { EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Download } from "lucide-react";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import Comments from "../../layout/comments";
import ReferencesSidebar from "../BlockEditor/components/ReferencesSidebar";
import CustomImage from "../customImage";
import { LinkMenu } from "../menus";
import { ContentItemMenu } from "../menus/ContentItemMenu";
import { TextMenu } from "../menus/TextMenu";
import PlaceholderExtension from "../placeholder-extension";
import { Button } from "../ui/Button";
import { EditorHeader } from "./components/EditorHeader";
import { TOCSidebar } from "./components/TOCSidebar";

export const Rating = Mark.create({
  name: "rating",
  addAttributes() {
    return {
      rating: { default: 0 },
      sourceId: { default: null },
      targetId: { default: null },
      ratersCount: { default: 0 },
      isRatingNeeded: { default: false },
    };
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", { class: "rating", ...HTMLAttributes }, "⭐"];
  },
});

export const BlockEditor = ({
  id,
  content,
  title,
  connectedEntities,
  connectedDocs,
  connectedInbox,
  connectedObjects,
  connectedQueries,
  connectedComments,
  connectedStudies,
}: {
  type?: string;
  id?: string;
  content?: string;
  title?: string;
  connectedEntities?: string;
  connectedDocs?: string;
  connectedInbox?: string;
  connectedObjects?: string;
  connectedQueries?: string;
  connectedComments?: string;
  connectedStudies?: string;
}) => {
  const menuContainerRef = useRef(null);
  // const [isBlockEditor, setIsBlockEditor] = useState<boolean>(true);
  const [isLeftSideBarOpen, setIsLeftSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [createDraft] = useCreateDraftMutation();
  const [updateDraft] = useUpdateDraftMutation();
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [lastSavedContent, setLastSavedContent] = useState<string | null>(null); // To track changes
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);

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
      if (typeof content === "string" || content.tupe === "doc") {
        return JSON.parse(content);
      }
      // Ensure it has the required structure
      if (content && typeof content === "object" && content?.type === "doc") {
        return content;
      }
      // Fallback for invalid content
      return { type: "doc", content: [] };
    } catch (error) {
      console.error("Error parsing content:", error);
      return { type: "doc", content: [] }; // Default fallback
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
    extensions: [
      Paragraph,
      Document,
      Image,
      Text,
      StarterKit,
      Table,
      TableCell,
      TableHeader,
      TableRow,
      ListItem.configure({
        HTMLAttributes: {
          class: "list-item",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal",
        },
      }),
      Superscript.configure({
        HTMLAttributes: {
          class: "superscript",
        },
      }),
      Subscript.configure({
        HTMLAttributes: {
          class: "subscript",
        },
      }),
      Bold.configure({
        HTMLAttributes: {
          class: "font-bold",
        },
      }),
      Underline.configure({
        HTMLAttributes: {
          class: "underline",
        },
      }),
      Italic.configure({
        HTMLAttributes: {
          class: "italic",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc",
        },
      }),
      Link.configure({
        openOnClick: true,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      PlaceholderExtension,
      CustomImage,
    ],
    content: parsedContent || {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Welcome to your page! Here, you have the freedom to craft and arrange content by formatting text addinglinks,\n images, files and tables and even utilizing IGOR<sup>AI</sup>. The right sidebar provides otions to include references, \n highlights and images from connected documents. \n Have fun creating!",
            },
          ],
        },
      ],
    },
    onUpdate({ editor }) {
      const updatedJSON = editor.getJSON();
      saveContent(updatedJSON);
    },
  });

  // Debugging: Check if `customImage` is in the editor schema
  if (editor) {
    console.log("schema nodes?", editor.schema.nodes);
  }

  const isEditing = useSelector((state: RootState) => state.document.isEditing);

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
    <div className="flex pb-8" ref={menuContainerRef}>
      <div className="relative flex h-full max-w-full flex-1 flex-col">
        <EditorHeader
          editor={editor}
          collabState={collabState}
          users={users}
          isSidebarOpen={isLeftSideBarOpen}
          toggleLeftSidebar={toggleLeftSideBar}
          documentId={id}
        />
        <div className="flex flex-row overflow-hidden">
          <div className={`${isLeftSideBarOpen ? "flex w-full" : "hidden w-0"}`}>
            <TOCSidebar
              editor={editor}
              isOpen={isLeftSideBarOpen}
              connectedEntities={connectedEntities}
              title={title}
            />
          </div>
          <div className="mainEditor">
            <EditorContent
              key={editor?.view?.id || "editor"}
              editor={editor}
              className="flex overflow-y-scroll px-16 py-16"
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
                      <Button variant="ghost">Connect a query</Button>
                      <p className="text-gray-500">No connected objects</p>
                    </div>
                  ))}
              </div>
            </div>
            <div className="editorContentContainer" id="connectedComments">
              <Comments connectedComments={connectedComments} />
            </div>
          </div>
          <div className={`referenceSidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
            <ReferencesSidebar
              onToggleInnerSidebar={toggleInnerSidebar}
              isCollapsed={isSidebarCollapsed}
              connectedEntities={connectedEntities}
              connectedDocs={connectedDocs}
              connectedObjects={connectedObjects}
              connectedInbox={connectedInbox}
              editor={editor}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockEditor;

import { useCreateDraftMutation, useUpdateDraftMutation } from "@/api/documents/documentApi";
// import { toggleInnerSidebar } from "@/api/utilities/sidebarSlice";
import { SimilarDocumentModal } from "@/components/common/dialogs/similar-document-modal";
import ImageBlockMenu from "@/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/extensions/Table/menus";
import { useBlockEditor } from "@/hooks/use-block-editor";
import { TiptapCollabProvider } from "@hocuspocus/provider";
import { Mark } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Text from "@tiptap/extension-text";
import { EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Key } from "history";
import { Download } from "lucide-react";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Comments from "../../layout/comments";
import ReferencesSidebar from "../BlockEditor/components/ReferencesSidebar";
import CustomImage from "../custom-image";
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
  aiToken,
  ydoc,
  provider,
  type,
  content,
  id,
  title,
  connectedEntities,
  connectedDocs,
  connectedInbox,
  connectedObjects,
  connectedQueries,
  connectedComments,
  connectedStudies,
}: {
  aiToken?: string;
  ydoc: Y.Doc | null;
  provider?: TiptapCollabProvider | null | undefined;
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
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const parsedContent = useMemo(() => {
    try {
      return typeof content === "string" ? JSON.parse(content) : content;
    } catch (error) {
      console.error("Invalid content JSON:", error);
      return { type: "doc", content: [] };
    }
  }, [content]);

  const saveContent = useCallback(
    async (content) => {
      if (JSON.stringify(content) === lastSavedContent) {
        console.log("No changes detected.");
        return;
      }

      try {
        if (currentId) {
          await updateDraft({ id: currentId, content });
        } else {
          const response = await createDraft({ content });
          setCurrentId(response.data.id);
        }
        setLastSavedContent(JSON.stringify(content));
      } catch (error) {
        console.error("Error saving content:", error);
      }
    },
    [currentId, lastSavedContent, updateDraft, createDraft],
  );

  const extensions = useMemo(
    () => [
      StarterKit,
      Link.configure({ openOnClick: true }),
      Document,
      Paragraph.configure({ HTMLAttributes: { class: "editor_paragraph" } }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Text,
      Image,
      CustomImage,
      Rating,
      PlaceholderExtension,
    ],
    [],
  );

  const { editor, users, collabState } = useBlockEditor({
    aiToken,
    ydoc,
    provider,
    extensions,
    content: parsedContent || {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Welcome to your page! Here, you have the freedom to craft and arrange content by formatting text adding links, images, files, and tables.",
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
      {isLeftSideBarOpen || isEditing ? <TOCSidebar editor={editor} isOpen={true} /> : null}
      <div className="relative flex h-full max-w-full flex-1 flex-col">
        <EditorHeader
          editor={editor}
          collabState={collabState}
          users={users}
          isSidebarOpen={isLeftSideBarOpen}
          toggleLeftSidebar={toggleLeftSideBar}
          documentId={id}
        />
        <div className="flex flex-row">
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
          <div className="referenceSidebar">
            <ReferencesSidebar
              onToggleInnerSidebar={toggleInnerSidebar}
              // isCollapsed={isSidebarCollapsed}
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

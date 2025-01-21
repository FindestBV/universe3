import { useCreateDraftMutation, useUpdateDraftMutation } from "@/api/documents/documentApi";
import { setEditingState } from "@/api/documents/documentSlice";
import ReferencesSidebar from "@/components/common/sidebar/references-sidebar";
import ImageBlockMenu from "@/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/extensions/Table/menus";
import { useBlockEditor } from "@/hooks/use-block-editor";
import { useSidebar } from "@/hooks/useSidebar";
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
import * as Y from "yjs";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Comments from "../../layout/comments";
import CustomImage from "../custom-image";
import { LinkMenu } from "../menus";
import { ContentItemMenu } from "../menus/ContentItemMenu";
import { TextMenu } from "../menus/TextMenu";
import PlaceholderExtension from "../placeholder-extension";
import { Sidebar } from "../Sidebar";
import { Button } from "../ui/Button";
import { EditorHeader } from "./components/EditorHeader";

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [createDraft] = useCreateDraftMutation();
  const [updateDraft] = useUpdateDraftMutation();
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [lastSavedContent, setLastSavedContent] = useState<string | null>(null); // To track changes
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const leftSidebar = useSidebar();

  const parsedContent = useMemo(() => {
    try {
      return typeof content === "string" ? JSON.parse(content) : content;
    } catch (e) {
      console.error("Invalid content JSON:", e);
      return { type: "doc", content: [] };
    }
  }, [content]);

  const saveContent = useCallback(async () => {
    const editorContent = editor?.getJSON();
    if (!editorContent || JSON.stringify(editorContent) === lastSavedContent) {
      console.log("No changes detected, skipping save.");
      return;
    }

    try {
      if (currentId) {
        await updateDraft({ id: currentId, content: editorContent });
        console.log("Draft updated successfully");
      } else {
        const response = await createDraft({ content: editorContent });
        setCurrentId(response.data.id);
        console.log("Draft created with ID:", response.data.id);
      }
      setLastSavedContent(JSON.stringify(editorContent));
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  }, [lastSavedContent, updateDraft, createDraft]);

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
    <div className="flex h-screen pb-8" ref={menuContainerRef}>
      <Sidebar isOpen={!leftSidebar.isOpen} onClose={leftSidebar.close} editor={editor} />
      <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">
        <EditorHeader
          editor={editor}
          collabState={collabState}
          users={users}
          isSidebarOpen={leftSidebar.isOpen}
          toggleSidebar={leftSidebar.toggle}
          documentId={id}
        />
        <div className="flex flex-row">
          <div className="mainEditor">
            <EditorContent editor={editor} className="flex overflow-y-hidden py-16 max-lg:px-8" />
            <ContentItemMenu editor={editor} />
            <LinkMenu editor={editor} appendTo={menuContainerRef} />
            <TextMenu editor={editor} />
            <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
            <TableRowMenu editor={editor} appendTo={menuContainerRef} />
            <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
            <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
          </div>
          <div className="referenceSidebar">
            <ReferencesSidebar
              onToggleSidebar={toggleSidebar}
              connectedDocs={connectedDocs}
              connectedObjects={connectedObjects}
              connectedInbox={connectedInbox}
              connectedEntities={connectedEntities}
              connectedStudies={connectedStudies}
              editor={editor}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockEditor;

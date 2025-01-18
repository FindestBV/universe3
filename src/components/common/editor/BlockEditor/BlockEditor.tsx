import {
  useCreateDraftMutation,
  useFetchDraftQuery,
  useUpdateDraftMutation,
} from "@/api/documents/documentApi";
import SimilarDocumentModal from "@/components/common/dialogs/similar-document-modal";
import ReferencesSidebar from "@/components/common/sidebar/references-sidebar";
import { ImageBlockMenu } from "@/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/extensions/Table/menus";
import { useBlockEditor } from "@/hooks/use-block-editor";
import { useDebounceDataView } from "@/hooks/use-debounce-data-view";
import { useSidebar } from "@/hooks/useSidebar";
import { EditorContent } from "@tiptap/react";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Comments from "../../layout/comments";
import { ContentItemMenu } from "../menus/ContentItemMenu";
import { LinkMenu } from "../menus/LinkMenu";
import { TextMenu } from "../menus/TextMenu";
import { EditorHeader } from "./components/EditorHeader";

export const BlockEditor = ({
  content,
  connectedObjects,
  connectedQueries,
  connectedComments,
}: {
  content?: string;
  connectedObjects?: any;
  connectedQueries?: any;
  connectedComments?: any;
}) => {
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ content: string; updatedAt: string }[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [createDraft] = useCreateDraftMutation();
  const [updateDraft] = useUpdateDraftMutation();
  const { data: serverDraft } = useFetchDraftQuery(draftId, { skip: !draftId });

  const leftSidebar = useSidebar();

  const debouncedSaveChanges = useDebounceDataView(async (newContent: string) => {
    if (draftId) {
      const updatedAt = new Date().toISOString();
      setIsSaving(true);
      try {
        await updateDraft({ id: draftId, content: newContent, updatedAt }).unwrap();
        setLastSaved(updatedAt);
        setHistory((prev) => [...prev, { content: newContent, updatedAt }]);
      } catch {
        setError("Failed to save changes. Please try again.");
      } finally {
        setIsSaving(false);
      }
    }
  }, 1000);

  const saveChanges = useCallback(
    (newContent: string) => {
      debouncedSaveChanges(newContent);
    },
    [debouncedSaveChanges],
  );

  useEffect(() => {
    const initializeDraft = async () => {
      try {
        const result = await createDraft({ content: "" }).unwrap();
        console.log("Draft Created:", result); // Ensure the `id` is correct
        setDraftId(result.id); // Store the draft ID
      } catch {
        setError("Failed to create a new draft.");
      }
    };
    initializeDraft();
  }, [createDraft]);

  const parsedContent = useMemo(() => {
    if (typeof content === "string") {
      try {
        return JSON.parse(content);
      } catch {
        console.error("Failed to parse content.");
        return null;
      }
    }
    return content;
  }, [content]);

  const { editor, users, collabState } = useBlockEditor({
    content: parsedContent || { type: "doc", content: [] },
    onUpdate({ editor }) {
      const value = editor.getHTML();
      saveChanges(value);
    },
  });

  useEffect(() => {
    if (editor && serverDraft && serverDraft.content !== editor.getHTML()) {
      editor.commands.setContent(serverDraft.content);
    }
  }, [serverDraft, editor]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  if (!editor) return <p>Loading editor...</p>;

  return (
    <div className="flex h-screen pb-8" ref={menuContainerRef}>
      {/* Left Sidebar */}
      <div className={`leftSidebar ${leftSidebar.isOpen ? "w-1/4" : "w-0"} bg-gray-100`}>
        {/* Left sidebar content here */}
      </div>

      {/* Main Editor Area */}
      <div className="relative flex h-full flex-1 flex-col overflow-hidden">
        <EditorHeader
          editor={editor}
          collabState={collabState}
          users={users}
          isSidebarOpen={leftSidebar.isOpen}
          toggleSidebar={leftSidebar.toggle}
        />
        <EditorContent editor={editor} className="h-screen flex-1 p-16" />

        {/* Menus */}
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />

        {/* Linked Documents */}
        <div className="editorContentContainer">
          <h3>Linked Documents</h3>
          {connectedObjects?.documents?.map((doc) => (
            <SimilarDocumentModal key={doc.id} title={doc.title} id={doc.id} />
          ))}
        </div>

        {/* Connected Queries */}
        <div className="editorContentContainer">
          <h3>Connected Queries</h3>
          {connectedQueries?.map((query) => (
            <SimilarDocumentModal key={query.id} title={query.name} id={query.id} />
          ))}
        </div>

        {/* Connected Comments */}
        <div className="editorContentContainer">
          <Comments connectedComments={connectedComments} />
        </div>
      </div>

      {/* References Sidebar */}
      <ReferencesSidebar
        onToggleSidebar={toggleSidebar}
        isCollapsed={isSidebarCollapsed}
        connectedDocs={connectedObjects}
        editor={editor}
      />

      {/* Error and Status Messages */}
      {error && <p className="absolute left-4 top-4 text-red-500">{error}</p>}
      {isSaving && <p className="absolute right-4 top-4">Saving...</p>}
      {lastSaved && (
        <p className="absolute bottom-4 right-4">
          Last saved at {new Date(lastSaved).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default BlockEditor;

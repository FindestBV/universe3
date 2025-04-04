import { RootState, useAppSelector } from "@/store";
import { WebSocketStatus } from "@hocuspocus/provider";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  FileText,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table as TableIcon,
} from "lucide-react";

import { useCallback, useState } from "react";
import { useSelector } from "react-redux";

import { EditorHeader } from "../BlockEditor/components/EditorHeader";

interface SimpleEditorProps {
  content?: string | null;
  onUpdate?: (content: any) => void;
  editable?: boolean;
  documentId?: string;
  readOnly?: boolean;
  hideMenus?: boolean;
}

const SimpleToolbarButton = ({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`rounded p-2 hover:bg-gray-100 ${
      active ? "bg-blue-100 text-blue-700" : "text-gray-700"
    }`}
  >
    {children}
  </button>
);

export const SimpleEditor = ({
  content,
  onUpdate,
  documentId,
  readOnly,
  hideMenus,
}: SimpleEditorProps) => {
  const isEditing = readOnly
    ? false
    : useAppSelector((state: RootState) => state.document.isEditing);
  console.log("isEditing", isEditing);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      Superscript,
      Subscript,
      Highlight,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: typeof content === "string" ? (content ? JSON.parse(content) : null) : content,
    editable: readOnly ? false : isEditing,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onUpdate?.(json);
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter link URL:", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const addTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className={`mainEditor h-full w-full rounded-md ${isEditing ? "prose-editor shadow-md" : ""}`}
    >
      <div className="relative flex flex-col">
        {!hideMenus && (
          <div className="h-[60px] border-b border-gray-200">
            <div className="mx-12 flex flex-col py-2">
              <EditorHeader
                editor={editor}
                documentId={documentId}
                collabState={WebSocketStatus.Connected}
                users={[]}
              />
            </div>
          </div>
        )}
        <EditorContent
          editor={editor}
          className={`prose simple max-w-none flex-1 pb-6 focus:outline-none ${
            isEditing ? "prose-editor" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default SimpleEditor;

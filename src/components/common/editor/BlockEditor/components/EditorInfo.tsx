// import { setLockPage } from "@/api/documents/documentSlice";
import AskIgorModal from "@/components/common/dialogs/ask-igor";
// import LockPageConfirm from "@/components/common/dialogs/lock-page-confirm";
import { Button } from "@/components/ui/button";
import { RootState, useAppSelector } from "@/store";
import { WebSocketStatus } from "@hocuspocus/provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Editor } from "@tiptap/react";
import {
  Bold,
  ChevronDown,
  ChevronUp,
  Grid2x2,
  HighlighterIcon,
  ImagePlus,
  Italic,
  Link,
  Paperclip,
  Pilcrow,
  Redo2,
  RotateCcw,
  RotateCw,
  SquarePlus,
  Subscript,
  Superscript,
  Undo2,
} from "lucide-react";

import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { EditorUser } from "../types";
import ViewEditSwitch from "./ViewEditSwitch";

export type EditorInfoProps = {
  characters: number;
  words: number;
  collabState: WebSocketStatus;
  users: EditorUser[];
  id?: string;
  editor: string;
};

export const EditorInfo = memo(({ id, editor }: EditorInfoProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const isEditing = useAppSelector((state: RootState) => state.document.isEditing);
  const isLocked = useSelector((state: RootState) => state.document.isLocked);
  // const dispatch = useDispatch();

  if (!editor) return null;

  const buttons = [
    {
      label: "Bold",
      command: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      icon: <Bold size={16} />,
    },
    {
      label: "Italic",
      command: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      icon: <Italic size={16} />,
    },
    {
      label: "Superscript",
      command: () => editor.chain().focus().toggleSuperscript?.().run(),
      isActive: editor.isActive("superscript"),
      icon: <Superscript size={16} />,
    },
    {
      label: "Subscript",
      command: () => editor.chain().focus().toggleSubscript?.().run(),
      isActive: editor.isActive("subscript"),
      icon: <Subscript size={16} />,
    },

    {
      label: "Highlight",
      command: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("highlight"),
      icon: <HighlighterIcon size={16} />,
    },
  ];

  const formattingButtons = [
    {
      label: "Link",
      command: () => {
        const url = window.prompt("Enter link URL:");
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
      },
      isActive: editor.isActive("link"),
      icon: <Link size={16} />,
    },
    {
      label: "Image",
      command: () => {
        const url = window.prompt("Enter image URL:");
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      },
      isActive: editor.isActive("image"),
      icon: <ImagePlus size={16} />,
    },
    {
      label: "Table",
      command: () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      },
      isActive: editor.isActive("table"),
      icon: <Grid2x2 size={16} />,
    },
    {
      label: "Advanced",
      command: () => {
        // Add your advanced formatting options here
        const json = editor.getJSON();
        console.log("Current editor content:", json);
      },
      isActive: false,
      icon: <SquarePlus size={16} />,
    },
  ];

  const backForwardOptions = [
    {
      label: "Undo",
      command: () => editor.chain().focus().undo().run(),
      isActive: false, // Undo doesn't need an "active" state
      icon: <Undo2 size={16} />,
    },
    {
      label: "Redo",
      command: () => editor.chain().focus().redo().run(),
      isActive: false, // Same for Redo
      icon: <Redo2 size={16} />,
    },
  ];

  const headingOptions = [
    {
      label: "Paragraph",
      command: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive("paragraph"),
    },
    {
      label: "Heading 1",
      command: () => editor.chain().focus().setHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
    },
    {
      label: "Heading 2",
      command: () => editor.chain().focus().setHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
    },
    {
      label: "Heading 3",
      command: () => editor.chain().focus().setHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
    },
    {
      label: "Heading 4",
      command: () => editor.chain().focus().setHeading({ level: 4 }).run(),
      isActive: editor.isActive("heading", { level: 4 }),
    },
    {
      label: "Heading 5",
      command: () => editor.chain().focus().setHeading({ level: 5 }).run(),
      isActive: editor.isActive("heading", { level: 5 }),
    },
    {
      label: "Heading 6",
      command: () => editor.chain().focus().setHeading({ level: 6 }).run(),
      isActive: editor.isActive("heading", { level: 6 }),
    },
  ];

  const togglePin = (pinId: string) => {
    setIsPinned(!isPinned);
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="mr-4 flex flex-row items-center justify-center gap-2 text-right dark:border-neutral-200">
        <ViewEditSwitch id={id} />
        {/* <AskIgorModal isToolbar={true} iconOnly /> */}
        {isEditing && !isLocked ? (
          <>
            <AskIgorModal isToolbar={true} iconOnly />
            <div className="flex items-center justify-between">
              <DropdownMenu onOpenChange={(open) => setIsDropdownOpen(open)} className="ml-4">
                <DropdownMenuTrigger asChild>
                  <Button className="h-9 rounded border border-gray-300 bg-white px-2 py-1 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-blue-400">
                    <Pilcrow size={16} /> Paragraph
                    {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-10 w-40 border border-gray-200 bg-white p-1 shadow-md">
                  {headingOptions.map((option, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={option.command}
                      className={`cursor-pointer rounded p-2 text-left text-sm ${
                        option.isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                      }`}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="mx-4 h-6 border-l border-gray-300"></span>
              <div className="flex items-center space-x-2">
                {buttons.map((btn, index) => (
                  <button
                    key={index}
                    onClick={btn.command}
                    className={`rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-blue-400 ${
                      btn.isActive && "bg-blue-100 text-blue-700"
                    }`}
                    aria-label={btn.label}
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>
              <span className="mx-4 h-6 border-l border-gray-300"></span>
              <div className="flex items-center space-x-2">
                {formattingButtons.map((btn, index) => (
                  <button
                    key={index}
                    onClick={btn.command}
                    className={`rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-blue-400 ${
                      btn.isActive && "bg-blue-100 text-blue-700"
                    }`}
                    aria-label={btn.label}
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>
              <span className="mx-4 h-6 border-l border-gray-300"></span>
              <div className="flex items-center gap-1">
                {backForwardOptions.map((btn, index) => (
                  <button
                    key={index}
                    onClick={btn.command}
                    className={`rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-blue-400 ${
                      btn.isActive && "bg-blue-100 text-blue-700"
                    }`}
                    aria-label={btn.label}
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
});

EditorInfo.displayName = "EditorInfo";

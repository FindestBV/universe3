// import { setLockPage } from "@/api/documents/documentSlice";
import AskIgorModal from "@/components/common/dialogs/ask-igor";
import LockPageConfirm from "@/components/common/dialogs/lock-page-confirm";
import UserAvatar from "@/components/common/utilities/user-avatar";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { WebSocketStatus } from "@hocuspocus/provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Bold,
  ChevronDown,
  ChevronUp,
  Grid2x2,
  ImagePlus,
  Italic,
  Link,
  List,
  ListOrdered,
  Paperclip,
  Pilcrow,
  SquarePlus,
  Subscript,
  Superscript,
  Underline,
} from "lucide-react";

import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { EditorUser } from "../types";
import ViewEditSwitch from "./ViewEditSwitch";

export type EditorInfoProps = {
  characters: number;
  words: number;
  collabState: WebSocketStatus;
  users: EditorUser[];
  id?: string;
};

export const EditorInfo = memo(({ id }: EditorInfoProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const isEditing = useSelector((state: RootState) => state.document.isEditing);
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
      label: "Underline",
      command: () => editor.chain().focus().toggleUnderline?.().run(),
      isActive: editor.isActive("underline"),
      icon: <Underline size={16} />,
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
      label: "Bullet List",
      command: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      icon: <List size={16} />,
    },
    {
      label: "Numbered List",
      command: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      icon: <ListOrdered size={16} />,
    },
  ];

  const formattingButtons = [
    {
      label: "Link",
      command: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("link"),
      icon: <Link size={16} />,
    },
    {
      label: "Image",
      command: () => editor.chain().focus().toggleImage().run(),
      isActive: editor.isActive("image"),
      icon: <ImagePlus size={16} />,
    },
    {
      label: "File",
      command: () => editor.chain().focus().toggleFile().run(),
      isActive: editor.isActive("file"),
      icon: <Paperclip size={16} />,
    },
    {
      label: "Table",
      command: () => editor.chain().focus().toggleTable().run(),
      isActive: editor.isActive("table"),
      icon: <Grid2x2 size={16} />,
    },
    {
      label: "Advanced",
      command: () => editor.chain().focus().toggleTable().run(),
      isActive: editor.isActive("advanced"),
      icon: <SquarePlus size={16} />,
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

  const togglePin = (id) => {
    setIsPinned(!isPinned);
  };

  useEffect(() => {
    console.log("is page locked?", isLocked);
  }, [isLocked]);

  return (
    <div className="flex w-full items-center justify-start">
      <div className="mr-4 flex flex-row justify-center gap-2 border-r border-neutral-200 pr-4 text-right dark:border-neutral-200">
        {isEditing && !isLocked ? (
          <>
            <AskIgorModal />
            <DropdownMenu onOpenChange={(open) => setIsDropdownOpen(open)}>
              <DropdownMenuTrigger asChild>
                <Button className="h-9 rounded border border-gray-300 bg-white px-2 py-1 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-blue-400">
                  <Pilcrow size={16} />
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
            <span className="h-6 border-l border-gray-300"></span>
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
          </>
        ) : null}
      </div>
      <div className="mr-2 flex items-center gap-2">
        {!isLocked ? (
          <>
            <ViewEditSwitch id={id} />

            <span className="h-6 border-l border-gray-300"></span>
            {/* <button
              className={`flex items-center gap-2 rounded border border-gray-300 transition-all duration-150 ease-in-out ${isPinned ? "bg-[#4C0723] text-white" : "bg-white text-gray-700"} px-2 py-1 hover:bg-[#4C0723] hover:text-white`}
              aria-label="Pin"
              onClick={() => togglePin()}
            >
              <Pin size={16} />
              PIN
            </button>
            <ShareObject parentId={""} parentTitle={""} />
            <span className="h-6 border-l border-gray-300"></span> */}
          </>
        ) : null}

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="rotated" className="h-8 w-8 bg-transparent p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-50 border border-gray-200 bg-white p-4 shadow-md"
            side="bottom"
            align="end"
          >
            <DropdownMenuItem className="mb-1 flex items-center gap-3">
              <Link size={16} />
              Create Link
            </DropdownMenuItem>

            <DropdownMenuItem className="mb-1 flex items-center gap-3">
              <Download size={16} /> Export as DOCX
            </DropdownMenuItem>
            <DropdownMenuItem className="mb-1 flex items-center gap-3">
              <Download size={16} />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem className="mb-1 flex items-center gap-3">
              <Network size={16} />
              Open in Tree View
            </DropdownMenuItem>
            <DropdownMenuItem className="mb-1 flex items-center gap-3">
              <List size={16} />
              Open in List View
            </DropdownMenuItem>

            {isEditing && (
              <>
                <Separator className="my-2" />
                <DropdownMenuItem className="flex items-center gap-3 text-red-700">
                  <Trash size={16} className="text-red-700" />
                  DELETE
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu> */}
        <LockPageConfirm isLocked={isLocked} id={id} />

        <UserAvatar username="Ronan" />
      </div>
    </div>
  );
});

EditorInfo.displayName = "EditorInfo";

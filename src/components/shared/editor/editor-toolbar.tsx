import { Button } from "@/components/ui/button";
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
  Eye,
  FilePenLine,
  Grid2x2,
  ImagePlus,
  Italic,
  Link,
  List,
  ListOrdered,
  MoreHorizontal,
  Paperclip,
  Pilcrow,
  Pin,
  SquarePlus,
  Subscript,
  Superscript,
  Underline,
} from "lucide-react";

import { useState } from "react";

import AskIgorModal from "../dialogs/ask-igor";
import MinimizableDialog from "../dialogs/minimizable-dialog";
import ShareObject from "../dialogs/share-object";
import UserAvatar from "../utilities/user-avatar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EditorToolbar = ({ editor }: { editor: any }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

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

  return (
    <div className="toolbar sticky top-16 z-20 w-full border-b border-gray-300 bg-gray-100 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left Section: Formatting Buttons */}
        <div className="flex items-center space-x-2">
          <AskIgorModal />
          <DropdownMenu onOpenChange={(open) => setIsDropdownOpen(open)}>
            <DropdownMenuTrigger asChild>
              <Button className="rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-blue-400">
                <Pilcrow size={16} /> Paragraph
                {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-10 w-40 border border-gray-200 bg-white p-1 shadow-md">
              {headingOptions.map((option, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={option.command}
                  className={`cursor-pointer rounded p-2 text-sm ${
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
                className={`rounded border border-gray-300 bg-white p-1 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-blue-400 ${
                  btn.isActive && "bg-blue-100 text-blue-700"
                }`}
                aria-label={btn.label}
              >
                {btn.icon}
              </button>
            ))}
          </div>
          <span className="h-6 border-l border-gray-300"></span>
          <div className="flex items-center space-x-2">
            {formattingButtons.map((btn, index) => (
              <button
                key={index}
                onClick={btn.command}
                className={`rounded border border-gray-300 bg-white p-1 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-blue-400 ${
                  btn.isActive && "bg-blue-100 text-blue-700"
                }`}
                aria-label={btn.label}
              >
                {btn.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Right Section: View and Share Options */}
        <div className="flex items-center space-x-2">
          <button
            className="flex items-center gap-2 rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-blue-400"
            aria-label="View"
          >
            <Eye size={16} />
            VIEW
          </button>
          <button
            className="flex items-center gap-2 rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-blue-400"
            aria-label="Edit"
          >
            <FilePenLine size={16} />
            EDIT
          </button>
          <span className="h-6 border-l border-gray-300"></span>
          <button
            className="flex items-center gap-2 rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-blue-400"
            aria-label="Pin"
          >
            <Pin size={16} />
            PIN
          </button>
          <ShareObject parentId={""} parentTitle={""} />
          <MinimizableDialog />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="rotated" className="h-8 w-8 bg-transparent p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 border border-gray-200 bg-white p-1 shadow-md">
              <DropdownMenuItem>Open Page</DropdownMenuItem>
              <DropdownMenuItem>Open Preview</DropdownMenuItem>
              <DropdownMenuItem>Open in Tree View</DropdownMenuItem>
              <DropdownMenuItem>Open in List View</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <UserAvatar username="Ronan" />
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;

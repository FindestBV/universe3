import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { List, MoreHorizontal, Network, ScanEye, SquareArrowOutUpRight } from "lucide-react";

import AskIgorModal from "../modals/ask-igor";
import UserAvatar from "../utilities/user-avatar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EditorToolbar = ({ editor }: { editor: any }) => {
  console.log("editor in entity single toolabr", editor);

  if (!editor) return null;

  const buttons = [
    {
      label: "Bold",
      command: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      label: "Italic",
      command: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      label: "Underline",
      command: () => editor.chain().focus().toggleUnderline?.().run(), // Optional if underline is supported
      isActive: editor.isActive("underline"),
    },
    {
      label: "Bullet List",
      command: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
    },
    {
      label: "Numbered List",
      command: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
    },
  ];

  return (
    <div className="toolbar w-full border-b border-gray-300 bg-gray-100 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left Section: Ask Igor Button */}
        <div className="flex items-center justify-center gap-2">
          <AskIgorModal />
          <div className="flex items-center space-x-2">
            {/* Bold Button */}
            {buttons.map((btn, index) => (
              <button
                key={index}
                onClick={btn.command}
                className={`rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${btn.isActive && "active"}`}
                aria-label="Align Left"
              >
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h18M3 6h18M3 14h10M3 18h10"
                  />
                </svg> */}
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Section: Formatting and Alignment Options */}
        <div className="flex items-center space-x-2">
          <button
            className="rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Align Left"
          >
            VIEW
          </button>
          <button
            className="rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Align Left"
          >
            EDIT
          </button>
          {/* Divider */}
          <span className="h-6 border-l border-gray-300"></span>

          {/* Align Left */}
          <button
            className="rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Align Left"
          >
            PIN
          </button>

          {/* Align Center */}
          <button
            className="rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Align Center"
          >
            SHARE
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="rotated" className="h-8 w-8 bg-transparent p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="h-8 w-8 bg-white p-0">
              <DropdownMenuItem>
                <SquareArrowOutUpRight /> Open Page
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ScanEye /> Open Preview
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Network /> Open in Tree View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <List /> Open in List View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Align Right */}

          <UserAvatar username="Diqque" />
          {/* <button
            className="rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Align Right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 6h18M7 10h14M3 14h18M7 18h14"
              />
            </svg>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;

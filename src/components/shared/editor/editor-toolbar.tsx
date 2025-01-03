import { Bot } from "lucide-react";

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
        <div className="flex items-center space-x-2">
          <button
            className="flex gap-2 rounded-sm bg-[#3B82f6] px-4 py-2 text-white hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Ask Igor"
          >
            <Bot size={18} />
            <p>
              Ask IGOR <sup>AI</sup>
            </p>
          </button>
          <button
            className="rounded-sm bg-gray-200 bg-white px-4 py-2 text-slate-500 outline hover:bg-slate-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Ask Igor"
          >
            Search
          </button>
        </div>

        {/* Right Section: Formatting and Alignment Options */}
        <div className="flex items-center space-x-2">
          {/* Bold Button */}
          {buttons.map((btn, index) => (
            <button
              key={index}
              onClick={btn.command}
              className={`rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${btn.isActive && "active"}`}
              aria-label="Align Left"
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
                  d="M3 10h18M3 6h18M3 14h10M3 18h10"
                />
              </svg>
            </button>
          ))}
          {/* <button
          className="rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Bold"
        >
          
        </button> */}

          {/* Italic Button
        <button
          className="rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Italic"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 3h8m-4 0l-4 18m4-18h4" />
          </svg>
        </button>

        {/* Underline Button 
        <button
          className="rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Underline"
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
              d="M10 3v10a4 4 0 008 0V3m-8 18h8"
            />
          </svg>
        </button> */}

          {/* Divider */}
          <span className="h-6 border-l border-gray-300"></span>

          {/* Align Left */}
          <button
            className="rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Align Left"
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
                d="M3 10h18M3 6h18M3 14h10M3 18h10"
              />
            </svg>
          </button>

          {/* Align Center */}
          <button
            className="rounded border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Align Center"
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
                d="M4 6h16M6 10h12M4 14h16M6 18h12"
              />
            </svg>
          </button>

          {/* Align Right */}
          <button
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;

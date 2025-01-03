export const Toolbar = () => {
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
            className="rounded-sm bg-[#3B82f6] px-4 py-2 text-white hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Ask Igor"
          >
            Ask Igor
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
          {buttons.map((btn, index) => (
            <button key={index} onClick={btn.command} className={btn.isActive ? "active" : ""}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;

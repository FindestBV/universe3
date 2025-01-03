// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EditorToolbar = ({ editor }: { editor: any }) => {
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
    <div className="toolbar">
      {buttons.map((btn, index) => (
        <button key={index} onClick={btn.command} className={btn.isActive ? "active" : ""}>
          {btn.label}
        </button>
      ))}
    </div>
  );
};

export default EditorToolbar;

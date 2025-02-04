import { Group } from "./types";

export const GROUPS: Group[] = [
  {
    name: "ai",
    title: "AI",
    commands: [
      {
        name: "askIgor",
        label: "Ask Igor",
        iconName: "Bot",
        description: "Let AI finish your thoughts",
        shouldBeHidden: (editor) => editor.isActive("columns"),
        action: (editor) => editor.chain().focus().setAiWriter().run(),
      },
    ],
  },
  {
    name: "format",
    title: "Hierarchy",
    commands: [
      {
        name: "heading1",
        label: "Title",
        iconName: "Heading1",
        description: "High priority section title",
        aliases: ["h1"],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 1 }).run();
        },
      },
      {
        name: "heading2",
        label: "Subtitle",
        iconName: "Heading2",
        description: "Medium priority section title",
        aliases: ["h2"],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 2 }).run();
        },
      },
      {
        name: "heading3",
        label: "Section header",
        iconName: "Heading3",
        description: "Low priority section title",
        aliases: ["h3"],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 3 }).run();
        },
      },
    ],
  },
  {
    name: "lists",
    title: "Lists",
    commands: [
      {
        name: "bulletList",
        label: "Bullet List",
        iconName: "List",
        description: "Unordered list of items",
        aliases: ["ul"],
        action: (editor) => {
          editor.chain().focus().toggleBulletList().run();
        },
      },
      {
        name: "numberedList",
        label: "Numbered List",
        iconName: "ListOrdered",
        description: "Ordered list of items",
        aliases: ["ol"],
        action: (editor) => {
          editor.chain().focus().toggleOrderedList().run();
        },
      },
    ],
  },
  {
    name: "insert",
    title: "Insert",
    commands: [
      {
        name: "image",
        label: "Image",
        iconName: "Image",
        description: "Insert an image",
        aliases: ["img"],
        action: (editor) => {
          editor.chain().focus().setImageUpload().run();
        },
      },
      {
        name: "file",
        label: "File",
        iconName: "Paperclip",
        description: "Insert a file",
        shouldBeHidden: (editor) => editor.isActive("columns"),
        action: (editor) => {
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run();
        },
      },

      {
        name: "table",
        label: "Table",
        iconName: "Book",
        aliases: ["outline"],
        description: "Insert a table of contents",
        shouldBeHidden: (editor) => editor.isActive("columns"),
        action: (editor) => {
          editor.chain().focus().insertTableOfContents().run();
        },
      },

      {
        name: "visualizations",
        label: "Visualizations",
        iconName: "Flashlight",
        description: "Insert a custom visualization block",
        shouldBeHidden: (editor) => editor.isActive("columns"),
        action: (editor) => {
          editor
            .chain()
            .focus()
            .insertContent({
              type: "customBlock",
              attrs: { id: `custom-visual-${Date.now()}` },
            })
            .run();
        },
      },
    ],
  },

  {
    name: "advanced",
    title: "Advanced",
    commands: [
      {
        name: "table",
        label: "Results overview table",
        iconName: "Star",
        description: "Insert a table",
        aliases: ["results-overview"],
        shouldBeHidden: (editor) => editor.isActive("columns"),
        action: (editor) => {
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run();
        },
      },
      {
        name: "table",
        label: "Requirements overview table",
        iconName: "ListFilter",
        description: "Insert a table",
        aliases: ["requirements-table"],
        action: (editor) => {
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run();
        },
      },

      {
        name: "visualizations",
        label: "Visualizations",
        iconName: "Flashlight",
        description: "Insert a custom visualization block",
        shouldBeHidden: (editor) => editor.isActive("columns"),
        action: (editor) => {
          editor
            .chain()
            .focus()
            .insertContent({
              type: "customBlock",
              attrs: { id: `custom-visual-${Date.now()}` },
            })
            .run();
        },
      },
    ],
  },
];

export default GROUPS;

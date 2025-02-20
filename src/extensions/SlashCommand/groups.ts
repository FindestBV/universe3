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

      // {
      //   name: "visualization",
      //   label: "Visualization",
      //   iconName: "Flashlight",
      //   description: "Insert a custom visualization block",
      //   shouldBeHidden: (editor) => editor.isActive("columns"),
      //   action: (editor) => {
      //     editor
      //       .chain()
      //       .focus()
      //       .insertContent({
      //         type: "customBlock",
      //         attrs: { id: `custom-visual-${Date.now()}` },
      //       })
      //       .run();
      //   },
      // },

      {
        name: "visualization",
        label: "Visualization",
        iconName: "Flashlight",
        description: "Insert a custom visualization block",
        shouldBeHidden: (editor) => editor.isActive("columns"),
        action: (editor) => {
          // probably to be a cleaner wa
          const pathSegments = window.location.pathname.split("/");
          const pageId = pathSegments[pathSegments.length - 1];
          // console.log("editor", editor);
          // console.log("editor meta?", editor.state.doc.attrs);
          editor
            .chain()
            .focus()
            .insertContent({
              type: "customBlock",
              attrs: {
                id: `custom-visual-${Date.now()}`,
                dataUrl: `https://67005c054da5bd237553e174.mockapi.io/api/move-ro-move/saveddocuments/${pageId}`, // Example API
              },
            })
            .run();
        },
      },

      {
        name: "customGraphBlock",
        label: "Graph Block",
        iconName: "Flashlight",
        description: "Insert a custom visualization block",
        shouldBeHidden: (editor) => editor.isActive("columns"),
        action: (editor) => {
          editor
            .chain()
            .focus()
            .insertContent({
              type: "customGraphBlock",
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
        name: "maturity-radar",
        label: "Maturity Radar",
        iconName: "Target",
        description: "Insert a maturity radar block",
        shouldBeHidden: (editor) => editor.isActive("columns"),
        aliases: ["maturity-radar"],
        action: (editor) => {
          editor
            .chain()
            .focus()
            .insertContent({
              type: "maturityRadar",
              attrs: { id: `maturity-radar-${Date.now()}` },
            })
            .run();
        },
      },
    ],
  },
];

export default GROUPS;

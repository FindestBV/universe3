/* eslint-disable @typescript-eslint/no-unused-vars */
// node_modules
import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faBarsFilter,
  faBold,
  faBuilding,
  faBullseye,
  faClipboard,
  faCopy,
  faCut,
  faDatabase,
  faDiceD6,
  faDivide,
  faHighlighter,
  faImage,
  faItalic,
  faLink,
  faListOl,
  faListUl,
  faObjectGroup,
  faPaperclip,
  faParagraph,
  faPen,
  faPlus,
  faRedo,
  faRobot,
  faStar,
  faSubscript,
  faSuperscript,
  faTable,
  faTextSlash,
  faTrash,
  faTrashCan,
  faUndo,
  faXmark,
} from "@fortawesome/pro-solid-svg-icons";
import { ChainedCommands, Editor } from "@tiptap/core";
import { Bold } from "@tiptap/extension-bold";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Heading } from "@tiptap/extension-heading";
import { Highlight } from "@tiptap/extension-highlight";
import { Italic } from "@tiptap/extension-italic";
import { Link } from "@tiptap/extension-link";
import { ListItem } from "@tiptap/extension-list-item";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Text } from "@tiptap/extension-text";
import { Node } from "@tiptap/pm/model";
import { NodeSelection } from "@tiptap/pm/state";
import { Content, JSONContent, NodePos } from "@tiptap/react";
//Enums
import { LogFeatureNameEnum, ObjectTypeEnum, ToastTypeEnum } from "Enums";
// Helpers
import { CustomBlockquote, CustomImage, LogHelperSingleton, ToastHelperSingleton } from "Helpers";
// Interfaces
import { ICommand, IGroup, ILinkCommand } from "Interfaces";

export const DO_COMMANDS: ICommand[] = [
  {
    name: "undo",
    label: "Undo",
    icon: faUndo,
    description: "Undo",
    action: (editor) => editor.chain().focus().undo().scrollIntoView().run(),
    isActive: () => false,
  },
  {
    name: "redo",
    label: "Redo",
    icon: faRedo,
    description: "Redo",
    action: (editor) => editor.chain().focus().redo().scrollIntoView().run(),
    isActive: () => false,
  },
];

export const PARAGRAPH_COMMAND: ICommand = {
  name: "paragraph",
  label: "Paragraph",
  icon: faParagraph,
  description: "Normal text",
  action: (editor) =>
    editor.chain().focus().liftListItem(ListItem.name).setParagraph().scrollIntoView().run(),
  isActive: (editor) =>
    editor.isActive(Paragraph.name) &&
    !editor.isActive(OrderedList.name) &&
    !editor.isActive(BulletList.name),
};

export const LIST_COMMANDS: ICommand[] = [
  {
    name: "bulletList",
    label: "Bullet list",
    icon: faListUl,
    description: "Unordered list of items",
    aliases: ["ul"],
    shortcut: "-",
    action: (editor) => editor.chain().focus().toggleBulletList().scrollIntoView().run(),
    isActive: (editor) => editor.isActive(BulletList.name),
  },
  {
    name: "numberedList",
    label: "Numbered list",
    icon: faListOl,
    description: "Ordered list of items",
    aliases: ["ol"],
    shortcut: "1.",
    action: (editor) => editor.chain().focus().toggleOrderedList().scrollIntoView().run(),
    isActive: (editor) => editor.isActive(OrderedList.name),
  },
];

export const HEADING_COMMANDS: ICommand[] = [
  {
    name: "heading1",
    label: "Title",
    customIconAsHtml: "<span>H</span><span>1</span>",
    description: "High priority section title",
    aliases: ["h1"],
    shortcut: "#",
    action: (editor) =>
      editor
        .chain()
        .focus()
        .liftListItem(ListItem.name)
        .setHeading({ level: 1 })
        .scrollIntoView()
        .run(),
    isActive: (editor) => editor.isActive(Heading.name, { level: 1 }),
  },
  {
    name: "heading2",
    label: "Subtitle",
    customIconAsHtml: "<span>H</span><span>2</span>",
    description: "Medium priority section title",
    aliases: ["h2"],
    shortcut: "##",
    action: (editor) =>
      editor
        .chain()
        .focus()
        .liftListItem(ListItem.name)
        .setHeading({ level: 2 })
        .scrollIntoView()
        .run(),
    isActive: (editor) => editor.isActive(Heading.name, { level: 2 }),
  },
  {
    name: "heading3",
    label: "Section header",
    customIconAsHtml: "<span>H</span><span>3</span>",
    description: "Low priority section title",
    aliases: ["h3"],
    shortcut: "###",
    action: (editor) =>
      editor
        .chain()
        .focus()
        .liftListItem(ListItem.name)
        .setHeading({ level: 3 })
        .scrollIntoView()
        .run(),
    isActive: (editor) => editor.isActive(Heading.name, { level: 3 }),
  },
];

export const BOLD_COMMAND: ICommand = {
  name: "bold",
  label: "Bold",
  icon: faBold,
  description: "Bold text",
  action: (editor) => editor.chain().focus().toggleBold().scrollIntoView().run(),
  isActive: (editor) => editor.isActive(Bold.name),
};

export const ITALIC_COMMAND: ICommand = {
  name: "italic",
  label: "Italic",
  icon: faItalic,
  description: "Italic text",
  action: (editor) => editor.chain().focus().toggleItalic().scrollIntoView().run(),
  isActive: (editor) => editor.isActive(Italic.name),
};

export const HIGHLIGHT_COMMAND: ICommand = {
  name: "highlight",
  label: "Highlight",
  icon: faHighlighter,
  description: "Highlight text",
  action: (editor) => editor.chain().focus().toggleHighlight().scrollIntoView().run(),
  isActive: (editor) => editor.isActive(Highlight.name),
};

export const SCRIPTS_COMMANDS: ICommand[] = [
  {
    name: "superscript",
    label: "Superscript",
    icon: faSuperscript,
    description: "Superscript text",
    action: (editor) => editor.chain().focus().toggleSuperscript().scrollIntoView().run(),
    isActive: (editor) => editor.isActive(Superscript.name),
  },
  {
    name: "subscript",
    label: "Subscript",
    icon: faSubscript,
    description: "Subscript text",
    action: (editor) => editor.chain().focus().toggleSubscript().scrollIntoView().run(),
    isActive: (editor) => editor.isActive(Subscript.name),
  },
];

export const SET_LINK_COMMAND: ILinkCommand = {
  name: "link",
  label: "Link",
  icon: faLink,
  description: "Set link",
  action: (editor, options) => {
    if (!options || !options.url) return false;
    return editor
      .chain()
      .focus()
      .extendMarkRange(Link.name)
      .setLink({
        href: options.url,
        target: "_blank",
        rel: "noopener noreferrer",
      })
      .scrollIntoView()
      .run();
  },
  undoaction: (editor) =>
    editor.chain().focus().extendMarkRange(Link.name).unsetLink().scrollIntoView().run(),
  isActive: (editor) => editor.isActive(Link.name),
};

export const getLinkJSONContentAction = ({
  href,
  objectId,
  objectType,
  text,
}: {
  href: string;
  objectId?: string;
  objectType?: ObjectTypeEnum;
  text: string;
}): JSONContent => {
  const isObject: boolean =
    objectType !== undefined && [ObjectTypeEnum.Entity, ObjectTypeEnum.Study].includes(objectType);

  return {
    type: Text.name,
    marks: [
      {
        type: Link.name,
        attrs: {
          href,
          target: isObject ? null : "_blank",
          rel: isObject ? null : "noopener noreferrer",
          id: objectId,
          type: objectType,
        },
      },
    ],
    text,
  };
};

export const INSERT_LINK_COMMAND: ICommand = {
  name: "Insert link",
  label: "Insert link",
  description: "Insert link",
  icon: faLink,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    if (!options || !options.url || !options.linkText) return false;

    return insertContentAction(
      editor,
      getLinkJSONContentAction({
        href: options.url,
        objectId: options.objectId,
        objectType: options.objectType,
        text: options.linkText,
      }),
    );
  },
};

export const clearNodeFormattingAction = (
  editor: Editor,
  nodePos?: number,
  node?: Node,
): boolean => {
  if (!node || nodePos === undefined) return false;

  const chain = editor.chain().focus();

  chain.setNodeSelection(nodePos).unsetAllMarks();

  if (node.type.name !== Paragraph.name) {
    chain.setParagraph();
  }

  return chain.scrollIntoView().run();
};
export const CLEAR_NODE_FORMATTING_COMMAND: ICommand = {
  name: "clear formatting",
  label: "Clear formatting",
  description: "Clear node formatting",
  icon: faTextSlash,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    LogHelperSingleton.log(`${LogFeatureNameEnum.Reporting}-ClearNodeFormatting`);

    return clearNodeFormattingAction(editor, options?.nodePos, options?.node);
  },
};

export const INSERT_TABLE_COMMAND: ICommand = {
  name: "insert Table",
  label: "Table",
  editorMenuLabel: "Insert table",
  icon: faTable,
  description: "Insert table",
  action: (editor, options) => {
    if (options && !options.isFromSlashMenu && options.nodePos !== undefined) {
      const tiptapNodePos: NodePos | null = editor.$pos(options.nodePos);

      if (!tiptapNodePos) return false;

      insertParagraphAfterNodeAction(
        editor,
        tiptapNodePos.to - tiptapNodePos.size,
        tiptapNodePos.node,
        "/",
      );

      deleteSelectionTextAction(editor, "/");
    }
    return editor
      .chain()
      .focus()
      .insertTable({
        rows: options?.rows ?? 3,
        cols: options?.cells ?? 3,
        withHeaderRow: true,
      })
      .scrollIntoView()
      .run();
  },
  isActive: () => false,
};

const ADD_COLLUMN_BEFORE_COMMAND: ICommand = {
  name: "add column before",
  label: "Add column left",
  icon: faArrowLeft,
  description: "Add a column before the current column",
  action: (editor) => editor.chain().focus().addColumnBefore().scrollIntoView().run(),
  isActive: () => false,
};

const ADD_COLLUMN_AFTER_COMMAND: ICommand = {
  name: "add column after",
  label: "Add column right",
  icon: faArrowRight,
  description: "Add a column after the current column",
  action: (editor) => editor.chain().focus().addColumnAfter().scrollIntoView().run(),
  isActive: () => false,
};

const DELETE_COLUMN_COMMAND: ICommand = {
  name: "delete column",
  label: "Delete column",
  icon: faXmark,
  description: "Delete the current column",
  action: (editor) => editor.chain().focus().deleteColumn().scrollIntoView().run(),
  isActive: () => false,
  styleOptions: { type: "danger" },
};

const ADD_ROW_BEFORE_COMMAND: ICommand = {
  name: "add row before",
  label: "Add row above",
  icon: faArrowUp,
  description: "Add a row before the current row",
  action: (editor) => editor.chain().focus().addRowBefore().scrollIntoView().run(),
  isActive: () => false,
};

const ADD_ROW_AFTER_COMMAND: ICommand = {
  name: "add row after",
  label: "Add row below",
  icon: faArrowDown,
  description: "Add a row after the current row",
  action: (editor) => editor.chain().focus().addRowAfter().scrollIntoView().run(),
  isActive: () => false,
};

const DELETE_ROW_COMMAND: ICommand = {
  name: "delete row",
  label: "Delete row",
  icon: faXmark,
  description: "Delete the current row",
  action: (editor) => editor.chain().focus().deleteRow().scrollIntoView().run(),
  isActive: () => false,
  styleOptions: { type: "danger" },
};

const DELETE_TABLE_COMMAND: ICommand = {
  name: "delete Table",
  label: "Delete entire table",
  icon: faTrashCan,
  description: "Delete the current table",
  action: (editor) => editor.chain().focus().deleteTable().scrollIntoView().run(),
  isActive: () => false,
  styleOptions: { type: "danger" },
};

const MERGE_CELLS_COMMAND: ICommand = {
  name: "merge cells",
  label: "Merge cells",
  icon: faObjectGroup,
  description: "Merge the selected cells",
  action: (editor) => {
    editor.chain().focus().mergeCells().scrollIntoView().run();
    return true;
  },
  isActive: () => false,
};

const SPLIT_CELL_COMMAND: ICommand = {
  name: "split cell",
  label: "Split cells",
  icon: faDivide,
  description: "Split the current cell",
  action: (editor) => editor.chain().focus().splitCell().scrollIntoView().run(),
  isActive: () => false,
};

export const TABLE_COMMANDS = {
  INSERT_TABLE_COMMAND,
  ADD_COLLUMN_BEFORE_COMMAND,
  ADD_COLLUMN_AFTER_COMMAND,
  DELETE_COLUMN_COMMAND,
  ADD_ROW_BEFORE_COMMAND,
  ADD_ROW_AFTER_COMMAND,
  DELETE_ROW_COMMAND,
  DELETE_TABLE_COMMAND,
  MERGE_CELLS_COMMAND,
  SPLIT_CELL_COMMAND,
};

export const duplicateNodeAction = (editor: Editor, nodePos?: number, node?: Node): boolean => {
  if (!node || nodePos === undefined) return false;

  editor.chain().focus().setNodeSelection(nodePos);

  const { $anchor } = editor.state.selection;
  const selectedNode = $anchor.node(1) || (editor.state.selection as NodeSelection).node;

  return editor
    .chain()
    .setMeta("hideDragHandle", true)
    .insertContentAt(nodePos + (node.nodeSize || 0), selectedNode.toJSON())
    .setNodeSelection(nodePos + (node.nodeSize || 0))
    .scrollIntoView()
    .run();
};
export const DUPLICATE_NODE_COMMAND: ICommand = {
  name: "duplicate",
  label: "Duplicate",
  description: "Duplicate node",
  icon: faCopy,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    LogHelperSingleton.log(`${LogFeatureNameEnum.Reporting}-DuplicateNode`);

    return duplicateNodeAction(editor, options?.nodePos, options?.node);
  },
};

export const deleteNodeAction = (editor: Editor, nodePos?: number): boolean => {
  if (nodePos === undefined) return false;

  return editor
    .chain()
    .focus()
    .setMeta("hideDragHandle", true)
    .setNodeSelection(nodePos)
    .deleteSelection()
    .scrollIntoView()
    .run();
};
export const DELETE_NODE_COMMAND: ICommand = {
  name: "delete",
  label: "Delete",
  description: "Delete node",
  icon: faTrash,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    LogHelperSingleton.log(`${LogFeatureNameEnum.Reporting}-DeleteNode`);

    return deleteNodeAction(editor, options?.nodePos);
  },
};

export const SET_CONTENT_COMMAND: ICommand = {
  name: "set content",
  label: "Set content",
  description: "Set content",
  icon: faPlus,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    if (!options || !options.content) return false;

    // when content has a NodeViewWrapper (IntakeSheet for example), it throws a warning: "flushSync was called from inside a lifecycle method..."
    // it is a known issue but not a real problem (see https://github.com/ueberdosis/tiptap/issues/3580)
    // we can not use a solution based on queueMicrotask or setTimeout because it will break the logic where this action is called (EditorProvider, when cleaning history)
    return editor
      .chain()
      .setMeta("doNotTriggerUpdate", true)
      .setContent(options.content, true)
      .run();
  },
};

export const insertContentAction = (editor: Editor, content: Content): boolean => {
  return editor.chain().focus().insertContent(content).scrollIntoView().run();
};

export const INSERT_CONTENT_COMMAND: ICommand = {
  name: "insert content",
  label: "Insert content",
  description: "Insert content",
  icon: faPlus,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    if (!options || !options.content) return false;

    return insertContentAction(editor, options.content);
  },
};

const copyNodeAction = (editor: Editor, nodePos: number): void => {
  editor.chain().focus().setNodeSelection(nodePos).scrollIntoView().run();
  document.execCommand("copy");
};

export const COPY_NODE_COMMAND: ICommand = {
  name: "copy",
  label: "Copy",
  description: "Copy node",
  icon: faClipboard,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    if (!options || options.nodePos === undefined) return false;

    LogHelperSingleton.log(`${LogFeatureNameEnum.Reporting}-CopyNode`);

    copyNodeAction(editor, options.nodePos);
    return true;
  },
};

export const CUT_NODE_COMMAND: ICommand = {
  name: "cut",
  label: "Cut",
  description: "Cut node",
  icon: faCut,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    if (!options || options.nodePos === undefined) return false;
    copyNodeAction(editor, options.nodePos);

    LogHelperSingleton.log(`${LogFeatureNameEnum.Reporting}-CutNode`);

    return deleteNodeAction(editor, options.nodePos);
  },
};

export const insertParagraphAfterNodeAction = (
  editor: Editor,
  nodePos?: number,
  node?: Node,
  paragraphText = "/",
): boolean => {
  if (!node || nodePos === undefined) return false;

  if (nodePos !== -1) {
    const currentNodeSize = node.nodeSize || 0;
    const insertPos = nodePos + currentNodeSize;
    const currentNodeIsEmptyParagraph =
      node.type.name === Paragraph.name && node.content?.size === 0;
    const focusPos = currentNodeIsEmptyParagraph ? nodePos + 2 : insertPos + 2;

    return editor
      .chain()
      .focus()
      .command(({ dispatch, tr, state }) => {
        if (dispatch) {
          if (currentNodeIsEmptyParagraph) {
            tr.insertText(paragraphText, nodePos, nodePos + 1);
          } else {
            tr.insert(
              insertPos,
              state.schema.nodes.paragraph.create(null, [state.schema.text(paragraphText)]),
            );
          }

          return dispatch(tr);
        }

        return true;
      })
      .focus(focusPos)
      .scrollIntoView()
      .run();
  }

  return false;
};
export const INSERT_AFTER_NODE_COMMAND: ICommand = {
  name: "insert",
  label: "Insert",
  description: "Insert",
  icon: faPlus,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    return insertParagraphAfterNodeAction(editor, options?.nodePos, options?.node);
  },
};

export const deleteSelectionTextAction = (editor: Editor, text: string): boolean => {
  const { $head, $from } = editor.view.state.selection;

  const end = $from.pos;
  const from = $head?.nodeBefore
    ? end - ($head.nodeBefore.text?.substring($head.nodeBefore.text?.indexOf(text)).length ?? 0)
    : $from.start();

  return editor.chain().focus().deleteRange({ from, to: end }).scrollIntoView().run();
};

export const CREATE_ENTITY_COMMAND: ICommand = {
  name: "create entity",
  label: "Entity",
  description: "Create entity",
  icon: faDiceD6,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    if (!options || !options.objectId || !options.objectType || !options.url) {
      return false;
    }

    return editor
      .chain()
      .focus()
      .unsetAllMarks()
      .extendMarkRange(Link.name)
      .setMark(Link.name, {
        href: options.url,
        id: options.objectId,
        type: options.objectType,
      })
      .scrollIntoView()
      .run();
  },
};

export const WRITE_SECTION_COMMAND: ICommand = {
  name: "write section",
  label: "Write section",
  description: "Write section",
  icon: faPen,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    if (!options || options.nodePos === undefined) return false;

    const tiptapNodePos: NodePos | null = editor.$pos(options.nodePos);

    if (!tiptapNodePos) return false;

    insertParagraphAfterNodeAction(
      editor,
      tiptapNodePos.to - tiptapNodePos.size,
      tiptapNodePos.node,
      "/",
    );

    return deleteSelectionTextAction(editor, "/");
  },
};

export const blurAction = (editor: Editor): boolean => {
  return editor.chain().blur().run();
};

export const ASK_IGOR_COMMAND: ICommand = {
  name: "askIgor",
  label: "Ask Igor",
  description: "Ask Igor",
  icon: faRobot,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    if (!options || options.nodePos === undefined) return false;

    if (options.isFromSlashMenu) {
      deleteSelectionTextAction(editor, "/");
      return blurAction(editor);
    }

    const tiptapNodePos: NodePos | null = editor.$pos(options.nodePos);

    if (!tiptapNodePos) return false;

    insertParagraphAfterNodeAction(
      editor,
      tiptapNodePos.to - tiptapNodePos.size,
      tiptapNodePos.node,
      "/",
    );

    deleteSelectionTextAction(editor, "/");

    return blurAction(editor);
  },
};

export const INSERT_MATURITY_RADAR_COMMAND: ICommand = {
  name: "insert maturity radar",
  label: "Maturity radar",
  description: "Insert maturity radar",
  icon: faBullseye,
  isActive: () => {
    return false;
  },
  action() {
    return true;
  },
};

export const INSERT_REQUIREMENTS_TABLE_COMMAND: ICommand = {
  name: "insert requirements table",
  label: "Requirements table",
  description: "Insert requirements table",
  icon: faBarsFilter,
  isActive: () => {
    return false;
  },
  action() {
    return true;
  },
};

export const INSERT_INTAKE_SHEET_COMMAND: ICommand = {
  name: "insert intake sheet",
  label: "Intake sheet",
  description: "Insert intake sheet",
  icon: faBuilding,
  isActive: (_) => {
    return false;
  },
  action(editor, options) {
    // If options are not provided, set them to default values.
    // Intake sheet insert to the beginning of the document
    if (!options) options = {};
    if (!options.nodePos) {
      options.nodePos = 0;
    }

    // Insert the intake sheet node with default attributes
    const isIntakeSheetExists = editor.$nodes("intakeSheet");
    if (isIntakeSheetExists && isIntakeSheetExists.length > 0) {
      ToastHelperSingleton.showToast(
        ToastTypeEnum.Error,
        "An intake sheet is already in the document",
      );
      return false;
    }

    const tiptapNodePos: NodePos | null = editor.$pos(options?.nodePos);

    if (!tiptapNodePos) return false;

    insertParagraphAfterNodeAction(
      editor,
      tiptapNodePos.to - tiptapNodePos.size,
      tiptapNodePos.node,
      "/",
    );

    const content = [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "Intake sheet" }],
      },
      { type: "paragraph" },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Challenge description" }],
      },
      { type: "paragraph" },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Requirements" }],
      },
      { type: "paragraph" },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Constraints" }],
      },
      { type: "paragraph" },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Ideal outcome" }],
      },
      { type: "paragraph" },
      {
        type: "intakeSheet",
        attrs: {
          confirmed: false,
          confirmedBy: "",
          date: "", // Default date to current date
        },
      },
      { type: "paragraph" },
    ];

    LogHelperSingleton.log(`${LogFeatureNameEnum.Reporting}-InsertIntakeSheet`);

    return insertContentAction(editor, content);
  },
};

export const FOCUS_COMMAND: ICommand = {
  name: "focus",
  label: "Focus",
  description: "Focus",
  icon: faBullseye,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    return editor
      .chain()
      .setMeta("doNotTriggerUpdate", true)
      .setTextSelection(editor.state.doc.content.size)
      .focus(options?.focusPosition, options?.focusOptions)
      .run();
  },
};

export const SET_META_COMMAND: ICommand = {
  name: "set meta",
  label: "Set meta",
  description: "Set meta",
  icon: faDatabase,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    if (!options || !options.metaKey || options.metaValue === undefined) {
      return false;
    }

    return editor.chain().setMeta(options.metaKey, options.metaValue).run();
  },
};

export const SET_IMAGE_AT_NODE_POS_COMMAND: ICommand = {
  name: "set image at node pos",
  label: "Set image at node pos",
  description: "Set image at node pos",
  icon: faImage,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    if (!options || options.nodePos === undefined || !options.imageUrl || !options.imageId) {
      return false;
    }

    return editor
      .chain()
      .setMeta("doNotTriggerUpdate", true)
      .setNodeSelection(options.nodePos)
      .setCustomImage(
        {
          src: options.imageUrl,
          id: options.imageId,
        },
        options.content ?? [],
      )
      .run();
  },
};

export const getImageJSONContentAction = ({
  caption,
  documentUrl,
  image,
  imageUrl,
  imageId,
  objectId,
  objectType,
}: {
  caption?: string;
  documentUrl?: string;
  image?: File;
  imageUrl?: string;
  imageId?: string;
  objectId?: string;
  objectType?: ObjectTypeEnum;
}): JSONContent[] => {
  const captionJSONContent: JSONContent[] = [];

  if (caption) {
    captionJSONContent.push({
      type: Text.name,
      text: `${documentUrl ? `${caption} ` : caption}`,
    });
  }

  if (documentUrl) {
    captionJSONContent.push(
      getLinkJSONContentAction({
        href: documentUrl,
        objectId,
        objectType,
        text: "[Ref]",
      }),
    );
  }

  const src: string = image ? URL.createObjectURL(image) : (imageUrl ?? "");

  return [
    {
      type: CustomImage.name,
      attrs: {
        src,
        id: imageId ?? "",
      },
      content: captionJSONContent,
    },
  ];
};

export const INSERT_IMAGE_COMMAND: ICommand = {
  name: "insert image",
  label: "Image",
  description: "Insert image",
  icon: faImage,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    if (options && options.nodePos !== undefined) {
      const tiptapNodePos: NodePos | null = editor.$pos(options.nodePos);

      if (!tiptapNodePos) return false;

      insertParagraphAfterNodeAction(
        editor,
        tiptapNodePos.to - tiptapNodePos.size,
        tiptapNodePos.node,
        "/",
      );

      deleteSelectionTextAction(editor, "/");
    }

    if (
      !options ||
      options.isFromSlashMenu ||
      (!options.image && !options.imageUrl) ||
      !options.imageId
    ) {
      return false;
    }

    return insertContentAction(
      editor,
      getImageJSONContentAction({
        caption: options.caption,
        documentUrl: options.documentUrl,
        image: options.image,
        imageUrl: options.imageUrl,
        imageId: options.imageId,
        objectId: options.objectId,
        objectType: options.objectType,
      }),
    );
  },
};

export const INSERT_BLOCKQUOTE_COMMAND: ICommand = {
  name: "insert highlight",
  label: "Insert highlight",
  description: "Insert highlight",
  icon: faHighlighter,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    if (!options) return false;

    if (!options.isFromSlashMenu && options.nodePos !== undefined) {
      const tiptapNodePos: NodePos | null = editor.$pos(options.nodePos);

      if (!tiptapNodePos) return false;

      insertParagraphAfterNodeAction(
        editor,
        tiptapNodePos.to - tiptapNodePos.size,
        tiptapNodePos.node,
        "/",
      );

      deleteSelectionTextAction(editor, "/");
    }

    const blockquoteJSONContent: JSONContent = {
      type: CustomBlockquote.name,
      attrs: {
        id: options.highlightId ?? "",
      },
      content:
        options.highlightText && options.highlightText.content
          ? [...options.highlightText.content]
          : [
              {
                type: Paragraph.name,
                content: [],
              },
            ],
    };

    if (options.documentUrl && options.objectId && options.objectType) {
      const documentUrlRef: JSONContent = {
        type: Paragraph.name,
        content: [
          getLinkJSONContentAction({
            href: options.documentUrl,
            objectId: options.objectId,
            objectType: options.objectType,
            text: "[Ref]",
          }),
        ],
      };

      blockquoteJSONContent.content?.push(documentUrlRef);
    }

    return insertContentAction(editor, blockquoteJSONContent);
  },
};

export const INSERT_OBJECT_REFERENCE_LINK_COMMAND: ICommand = {
  name: "insert object reference link",
  label: "Insert object reference link",
  description: "Insert object reference link",
  icon: faLink,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    if (
      !options ||
      !options.objectId ||
      !options.objectType ||
      !options.url ||
      !options.objectName
    ) {
      return false;
    }

    return insertContentAction(
      editor,
      getLinkJSONContentAction({
        href: options.url,
        objectId: options.objectId,
        objectType: options.objectType,
        text: options.objectName,
      }),
    );
  },
};

export const SET_FILE_AT_NODE_POS_COMMAND: ICommand = {
  name: "set file at node pos",
  label: "Set file at node pos",
  description: "Set file at node pos",
  icon: faPaperclip,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    if (
      !options ||
      options.nodePos === undefined ||
      options.toNodePos === undefined ||
      !options.url ||
      !options.objectId ||
      !options.objectType
    ) {
      return false;
    }

    return editor
      .chain()
      .setMeta("doNotTriggerUpdate", true)
      .command(({ tr }) => {
        tr.removeMark(
          options.nodePos as number,
          options.toNodePos as number,
          editor.state.schema.marks.link,
        ).addMark(
          options.nodePos as number,
          options.toNodePos as number,
          editor.state.schema.marks.link.create({
            href: options.url,
            target: "_blank",
            rel: "noopener noreferrer",
            id: options.objectId,
            type: options.objectType,
          }),
        );

        return true;
      })
      .run();
  },
};

export const INSERT_FILE_COMMAND: ICommand = {
  name: "insert file",
  label: "File",
  description: "Insert file",
  icon: faPaperclip,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    if (
      !options ||
      !options.url ||
      !options.objectId ||
      !options.objectType ||
      !options.fileName ||
      options.isFromSlashMenu
    ) {
      return false;
    }

    return insertContentAction(
      editor,
      getLinkJSONContentAction({
        href: options.url,
        objectId: options.objectId,
        objectType: options.objectType,
        text: options.fileName,
      }),
    );
  },
};

export const SET_RATING_AT_NODE_POS_COMMAND: ICommand = {
  name: "set rating at node pos",
  label: "Set rating at node pos",
  description: "Set rating at node pos",
  icon: faStar,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    if (
      !options ||
      options.nodePos === undefined ||
      options.rating === undefined ||
      options.isRatingNeeded === undefined ||
      options.ratersCount === undefined ||
      !options.objectId ||
      options.objectType === undefined ||
      !options.targetId
    ) {
      return false;
    }

    const chainedCommands: ChainedCommands = editor.chain();

    if (options.metaKey && options.metaValue) {
      chainedCommands.setMeta(options.metaKey, options.metaValue);
    }

    return chainedCommands
      .setNodeSelection(options.nodePos)
      .setRating({
        rating: options.rating,
        sourceId: options.objectId,
        sourceType: options.objectType,
        targetId: options.targetId,
        ratersCount: options.ratersCount,
        isRatingNeeded: options.isRatingNeeded,
      })
      .run();
  },
};

export const INSERT_RESULTS_OVERVIEW_TABLE_COMMAND: ICommand = {
  name: "insert results overview table",
  label: "Results overview table",
  description: "Insert results overview table",
  icon: faStar,
  isActive: () => {
    return false;
  },
  action(editor, options) {
    if (!options || options.isFromSlashMenu || options.nodePos === undefined || !options.content) {
      return false;
    }

    const tiptapNodePos: NodePos | null = editor.$pos(options.nodePos);

    if (!tiptapNodePos) return false;

    insertParagraphAfterNodeAction(
      editor,
      tiptapNodePos.to - tiptapNodePos.size,
      tiptapNodePos.node,
      "/",
    );

    deleteSelectionTextAction(editor, "/");

    return insertContentAction(editor, options.content);
  },
};

export const isContentEmpty = (content: Content | undefined): boolean => {
  if (!content) return true;

  if (typeof content === "string") {
    return content.trim() === "";
  }

  if (Array.isArray(content)) {
    return content.every((currentContent) => isContentEmpty(currentContent));
  }

  if ("text" in content) {
    return isContentEmpty(content.text);
  }

  if (!content.content) return true;

  return isContentEmpty(content.content);
};

export const TABLE_GROUP: IGroup = {
  name: "table",
  label: "Table",
  commands: [INSERT_TABLE_COMMAND, DELETE_TABLE_COMMAND],
};

export const TABLE_COLUMN_GROUP: IGroup = {
  name: "column",
  label: "Column",
  commands: [ADD_COLLUMN_AFTER_COMMAND, ADD_COLLUMN_BEFORE_COMMAND, DELETE_COLUMN_COMMAND],
};

export const TABLE_ROW_GROUP: IGroup = {
  name: "row",
  label: "Row",
  commands: [ADD_ROW_BEFORE_COMMAND, ADD_ROW_AFTER_COMMAND, DELETE_ROW_COMMAND],
};

export const TABLE_CELL_GROUP: IGroup = {
  name: "cell",
  label: "Cell",
  commands: [MERGE_CELLS_COMMAND, SPLIT_CELL_COMMAND],
};

export const AI_GROUP: IGroup = {
  name: "ai",
  label: "AI",
  commands: [ASK_IGOR_COMMAND],
};

export const TEXT_SELECTED_AI_GROUP: IGroup = {
  name: "ai",
  label: "AI",
  commands: [WRITE_SECTION_COMMAND, ASK_IGOR_COMMAND],
};

export const HIERARCHY_GROUP: IGroup = {
  name: "hierarchy",
  label: "Hierarchy",
  commands: HEADING_COMMANDS,
};

export const LISTS_GROUP: IGroup = {
  name: "lists",
  label: "Lists",
  commands: LIST_COMMANDS,
};

export const INSERT_GROUP: IGroup = {
  name: "insert",
  label: "Insert",
  commands: [INSERT_IMAGE_COMMAND, INSERT_FILE_COMMAND, TABLE_COMMANDS.INSERT_TABLE_COMMAND],
};

export const CREATE_GROUP: IGroup = {
  name: "create",
  label: "Create",
  commands: [CREATE_ENTITY_COMMAND],
};

export const ADVANCED_COMMANDS = [
  INSERT_INTAKE_SHEET_COMMAND,
  INSERT_RESULTS_OVERVIEW_TABLE_COMMAND,
  INSERT_REQUIREMENTS_TABLE_COMMAND,
  INSERT_MATURITY_RADAR_COMMAND,
];

export const ADVANCED_GROUP: IGroup = {
  name: "advanced",
  label: "Advanced",
  commands: ADVANCED_COMMANDS,
};

export const FORMAT_MENU_GROUPS: IGroup[] = [
  CREATE_GROUP,
  {
    ...HIERARCHY_GROUP,
    commands: [PARAGRAPH_COMMAND, ...HEADING_COMMANDS],
  },
  LISTS_GROUP,
];

export const SLASH_MENU_GROUPS: IGroup[] = [
  AI_GROUP,
  HIERARCHY_GROUP,
  LISTS_GROUP,
  INSERT_GROUP,
  ADVANCED_GROUP,
];

export const TABLE_MENU_GROUPS: IGroup[] = [
  TABLE_COLUMN_GROUP,
  TABLE_ROW_GROUP,
  TABLE_CELL_GROUP,
  TABLE_GROUP,
];

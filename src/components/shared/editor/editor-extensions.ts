import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";

import CustomImage from "./custom-image";

export const extensions = [
  Paragraph,
  Document,
  Image,
  CustomImage,
  Text,
  StarterKit,
  ListItem.configure({
    HTMLAttributes: {
      class: "list-item",
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: "list-decimal",
    },
  }),
  Superscript.configure({
    HTMLAttributes: {
      class: "superscript",
    },
  }),
  Subscript.configure({
    HTMLAttributes: {
      class: "subscript",
    },
  }),
  Bold.configure({
    HTMLAttributes: {
      class: "font-bold",
    },
  }),
  Underline.configure({
    HTMLAttributes: {
      class: "underline",
    },
  }),
  Italic.configure({
    HTMLAttributes: {
      class: "italic",
    },
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: "list-disc",
    },
  }),
  Link.configure({
    openOnClick: true,
  }),
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
];

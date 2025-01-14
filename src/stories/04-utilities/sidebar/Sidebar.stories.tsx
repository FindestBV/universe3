import { Sidebar } from "@/components/ui/sidebar";
// import { AppSidebar } from '@/components/shared/sidebar/app-sidebar';

import { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Components/ui/Sidebar",
  component: Sidebar,
  parameters: {
    docs: {
      description: {
        component:
          "The Editor component, powered by TipTap, is a versatile text editor with extensions for advanced features like tables, links, images, and more. Includes a reference sidebar and connected content.",
      },
    },
  },
  argTypes: {
    type: {
      control: "text",
      description: "The type of content being edited, e.g., 'document' or 'entity'.",
      defaultValue: "document",
    },
    title: {
      control: "text",
      description: "The title of the editor's content.",
      defaultValue: "My Document",
    },
    content: {
      control: "object",
      description: "The initial content of the editor in JSON format.",
      defaultValue: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "This is a default paragraph." }],
          },
        ],
      },
    },
    connectedDocs: {
      control: "object",
      description: "Connected documents displayed in the sidebar.",
      defaultValue: null,
    },
    connectedObjects: {
      control: "object",
      description: "Connected objects such as documents, inbox items, and queries.",
      defaultValue: null,
    },
    connectedQueries: {
      control: "object",
      description: "Queries linked to the editor content.",
      defaultValue: null,
    },
    connectedComments: {
      control: "object",
      description: "Comments linked to the editor content.",
      defaultValue: null,
    },
  },
};

export default meta;

type Story = StoryObj;

export const AppSidebar: Story = {
  args: {
    type: "document",
    title: "My Document",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Welcome to the editor. Start typing here!" }],
        },
      ],
    },
    connectedDocs: {
      documents: [
        { id: "1", title: "Connected Doc 1" },
        { id: "2", title: "Connected Doc 2" },
      ],
    },
    connectedObjects: {
      documents: [
        { id: "1", title: "Connected Doc 1" },
        { id: "2", title: "Connected Doc 2" },
      ],
    },
    connectedQueries: [
      {
        connectedObjects: [
          { id: "1", name: "Query 1" },
          { id: "2", name: "Query 2" },
        ],
      },
    ],
    connectedComments: [
      { id: "1", content: "Great job!" },
      { id: "2", content: "Consider rephrasing this paragraph." },
    ],
  },
};

export const ReferencesSidebar: Story = {
  args: {
    type: "document",
    title: "My Document",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Welcome to the editor. Start typing here!" }],
        },
      ],
    },
    connectedDocs: {
      documents: [
        { id: "1", title: "Connected Doc 1" },
        { id: "2", title: "Connected Doc 2" },
      ],
    },
    connectedObjects: {
      documents: [
        { id: "1", title: "Connected Doc 1" },
        { id: "2", title: "Connected Doc 2" },
      ],
    },
    connectedQueries: [
      {
        connectedObjects: [
          { id: "1", name: "Query 1" },
          { id: "2", name: "Query 2" },
        ],
      },
    ],
    connectedComments: [
      { id: "1", content: "Great job!" },
      { id: "2", content: "Consider rephrasing this paragraph." },
    ],
  },
};

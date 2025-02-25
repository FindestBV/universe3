import GenericCard from "@/components/common/cards/item-card";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Components/common/cards/LinkedCounts",
  component: GenericCard,
  parameters: {
    docs: {
      description: {
        component:
          "A flexible card component for various use cases, built on top of the Shadcn Card component.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof GenericCard>;

export const Default: Story = {
  args: {
    id: "1",
    title: "Example Document",
    name: "Sample Name",
    type: "document",
    itemType: "document",
    description:
      '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is a sample description for the GenericCard component."}]}]}',
    dateAdded: new Date().toISOString(),
    dateCreated: new Date().toISOString(),
    createdByUsername: "John Doe",
    url: "https://example.com",
    abstract: "An abstract summarizing the document content.",
    isSelected: false,
    onSelect: (id, selected) => console.log(`Selected: ${selected}, ID: ${id}`),
    connectedObjects: [],
    searchInformation: {},
    linkedCounts: {
      entityCount: 5,
      documentCount: 10,
    },
  },
  render: (args) => <GenericCard {...args} />,
};

export const Entity: Story = {
  args: {
    id: "1",
    title: "Example Document",
    name: "Sample Name",
    type: "document",
    itemType: "document",
    description:
      '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is a sample description for the GenericCard component."}]}]}',
    dateAdded: new Date().toISOString(),
    dateCreated: new Date().toISOString(),
    createdByUsername: "John Doe",
    url: "https://example.com",
    abstract: "An abstract summarizing the document content.",
    isSelected: false,
    onSelect: (id, selected) => console.log(`Selected: ${selected}, ID: ${id}`),
    connectedObjects: [],
    searchInformation: {},
    linkedCounts: {
      entityCount: 5,
      documentCount: 10,
    },
  },
  render: (args) => <GenericCard {...args} />,
};

export const Study: Story = {
  args: {
    ...Default.args,
    title: "Document with Actions",
    description:
      '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This document has additional actions like linking and deletion."}]}]}',
    connectedObjects: [
      { id: "2", name: "Connected Object 1", type: "document" },
      { id: "3", name: "Connected Object 2", type: "entity" },
    ],
  },
  render: (args) => <GenericCard {...args} />,
};

export const Document: Story = {
  args: {
    id: "1",
    title: "Example Document",
    name: "Sample Name",
    type: "document",
    itemType: "document",
    description:
      '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is a sample description for the GenericCard component."}]}]}',
    dateAdded: new Date().toISOString(),
    dateCreated: new Date().toISOString(),
    createdByUsername: "John Doe",
    url: "https://example.com",
    abstract: "An abstract summarizing the document content.",
    isSelected: false,
    onSelect: (id, selected) => console.log(`Selected: ${selected}, ID: ${id}`),
    connectedObjects: [],
    searchInformation: {},
    linkedCounts: {
      entityCount: 5,
      documentCount: 10,
    },
  },
  render: (args) => <GenericCard {...args} />,
};

export const Highlight: Story = {
  args: {
    id: "1",
    title: "Example Document",
    name: "Sample Name",
    type: "document",
    itemType: "document",
    description:
      '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is a sample description for the GenericCard component."}]}]}',
    dateAdded: new Date().toISOString(),
    dateCreated: new Date().toISOString(),
    createdByUsername: "John Doe",
    url: "https://example.com",
    abstract: "An abstract summarizing the document content.",
    isSelected: false,
    onSelect: (id, selected) => console.log(`Selected: ${selected}, ID: ${id}`),
    connectedObjects: [],
    searchInformation: {},
    linkedCounts: {
      entityCount: 5,
      documentCount: 10,
    },
  },
  render: (args) => <GenericCard {...args} />,
};

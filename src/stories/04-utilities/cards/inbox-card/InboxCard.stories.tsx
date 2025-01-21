import GenericCard from "@/components/common/cards/generic-card";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Components/common/cards/InboxCard",
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

export const Inbox: Story = {
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

import { DocumentSkeleton } from "@/components/shared/loaders/document-skeleton";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Components/shared/loaders/DocumentSkeleton",
  component: DocumentSkeleton,
  decorators: [
    (Story) => (
      <div style={{ margin: "2em" }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Avatar component using ShadCN. Displays an image or fallback initials when an image is unavailable.",
      },
    },
  },
  argTypes: {
    src: {
      control: "text",
      description: "URL of the avatar image.",
      defaultValue: "",
    },
    alt: {
      control: "text",
      description: "Alternative text for the avatar image.",
      defaultValue: "Avatar",
    },
    fallback: {
      control: "text",
      description: "Fallback content displayed when the image is unavailable.",
      defaultValue: "R",
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DocumentSkeleton />,
  args: {
    src: "",
    alt: "DocumentSkeleton",
    fallback: "RO",
  },
};
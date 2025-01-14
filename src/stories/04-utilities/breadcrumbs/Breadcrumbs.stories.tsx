import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Meta, StoryObj } from "@storybook/react";

// Adjust the path as needed

const meta: Meta = {
  title: "Components/ui/Breadcrumb",
  component: Breadcrumb,
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
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  args: {
    src: "",
    alt: "Avatar",
    fallback: "RO",
  },
};

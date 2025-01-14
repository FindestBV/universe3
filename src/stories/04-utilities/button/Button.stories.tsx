import { Button } from "@/components/ui/button";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Components/ui/Button",
  component: Button,
  parameters: {
    docs: {
      description: {
        component: "Button component using ShadCN. Includes variants, sizes, and states.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "secondary", "destructive", "ghost", "link"],
      description: "The style variant of the button.",
      defaultValue: "default",
    },
    size: {
      control: "select",
      options: ["sm", "lg"],
      description: "The size of the button.",
      defaultValue: "lg",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button if true.",
      defaultValue: false,
    },
    children: {
      control: "text",
      description: "The content inside the button.",
      defaultValue: "Button",
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: ({ variant, size, disabled, children }) => (
    <Button variant={variant} size={size} disabled={disabled}>
      {children}
    </Button>
  ),
  args: {
    variant: "default",
    size: "lg",
    disabled: false,
    children: "Default Button",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-row gap-4">
      <Button variant="default">Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-row gap-4">
      <Button size="sm">Small</Button>
      {/* <Button size="md">Medium</Button> */}
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-row gap-4">
      <Button variant="default" disabled>
        Disabled Default
      </Button>
      <Button variant="primary" disabled>
        Disabled Primary
      </Button>
      <Button variant="secondary" disabled>
        Disabled Secondary
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-row gap-4">
      <Button>
        <span className="mr-2">🚀</span> With Icon
      </Button>
      <Button variant="primary">
        <span className="mr-2">✨</span> Primary With Icon
      </Button>
      <Button variant="destructive">
        <span className="mr-2">⚠️</span> Destructive With Icon
      </Button>
    </div>
  ),
};

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Alert> = {
  title: "Components/ui/Alert",
  component: Alert,
  parameters: {
    docs: {
      description: {
        component:
          "An alert component for displaying important messages, with support for different variants and content layouts.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "destructive"],
      description: "Choose the style variant of the alert.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    variant: "default",
  },
  render: (args) => (
    <Alert {...args}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="h-4 w-4 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"
        />
      </svg>
      <div>
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription className="text-white">
          This is a default alert. You can add more information here.
        </AlertDescription>
      </div>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
  render: (args) => (
    <Alert {...args}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"
        />
      </svg>
      <div>
        <AlertTitle>Destructive Alert</AlertTitle>
        <AlertDescription>This is a destructive alert. Proceed with caution.</AlertDescription>
      </div>
    </Alert>
  ),
};

export const WithCustomContent: Story = {
  render: () => (
    <Alert>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"
        />
      </svg>
      <div>
        <AlertTitle>Custom Alert</AlertTitle>
        <AlertDescription>
          Add any custom content inside the alert, such as links or additional styling.
        </AlertDescription>
      </div>
    </Alert>
  ),
};

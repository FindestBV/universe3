import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Components/ui/Card",
  component: Card,
  parameters: {
    docs: {
      description: {
        component: "Card component with header, content, and footer using ShadCN.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Base: Story = {
  render: () => (
    <Card className="w-96 rounded-lg border shadow-sm">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>This is a description for the card.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card. You can include any elements or text here.</p>
      </CardContent>
      <CardFooter className="justify-end">
        <button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Action
        </button>
      </CardFooter>
    </Card>
  ),
};

export const WithCustomContent: Story = {
  render: () => (
    <Card className="w-96 rounded-lg border bg-gray-50 shadow-md">
      <CardHeader>
        <CardTitle className="text-blue-600">Custom Card Title</CardTitle>
        <CardDescription>This card has custom styling and content.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-1 pl-6">
          <li>Custom list item 1</li>
          <li>Custom list item 2</li>
          <li>Custom list item 3</li>
        </ul>
      </CardContent>
      <CardFooter className="justify-between">
        <button className="rounded-md border border-blue-500 px-4 py-2 text-blue-500 hover:bg-blue-100">
          Cancel
        </button>
        <button className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600">
          Save
        </button>
      </CardFooter>
    </Card>
  ),
};

import { ContextMenu } from "@/components/ui/context-menu";
import { Meta, StoryObj } from "@storybook/react";
import { BookOpen, Users } from "lucide-react";

const meta: Meta = {
  title: "Components/common/layout/Context Menu",
  component: ContextMenu,
  parameters: {
    docs: {
      description: {
        component:
          "A form to create a new item such as a study or entity, with optional customization options.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ContextMenu>;

const mockData: NewItem[] = [
  {
    type: "study",
    desc: "Create a new study and define its attributes.",
    icon: <BookOpen />,
  },
  {
    type: "entity",
    desc: "Create a new entity with customized details.",
    icon: <Users />,
  },
  {
    type: "document",
    desc: "Add a document to your library.",
  },
];

export const Default: Story = {
  render: () => <ContextMenu />,
};

import { CreateNewItem, NewItem } from "@/components/common/cards/create-new-item";
import { Meta, StoryObj } from "@storybook/react";
import { BookOpen, Users } from "lucide-react";

const meta: Meta<typeof CreateNewItem> = {
  title: "Components/common/cards/CreateNewItem",
  component: CreateNewItem,
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

type Story = StoryObj<typeof CreateNewItem>;

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
  render: () => (
    <div className="flex w-full gap-1">
      {mockData.map((item, index) => (
        <CreateNewItem key={index} {...item} />
      ))}
    </div>
  ),
};

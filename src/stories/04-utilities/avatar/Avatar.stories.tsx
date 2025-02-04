import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Meta, StoryObj } from "@storybook/react";

// Adjust the path as needed

const meta: Meta = {
  title: "Components/ui/Avatar",
  component: Avatar,
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
  render: ({ src, alt, fallback }) => (
    <Avatar>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  ),
  args: {
    src: "",
    alt: "Avatar",
    fallback: "RO",
  },
};

export const WithImage: Story = {
  render: ({ src, alt, fallback }) => (
    <Avatar>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  ),
  args: {
    src: "https://ronan-oleary.com/assets/ro-bw.d434f415.png",
    alt: "User Avatar",
    fallback: "RO",
  },
};

export const CustomFallback: Story = {
  render: ({ src, alt, fallback }) => (
    <Avatar>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="bg-[#006A86] text-white">{fallback}</AvatarFallback>
    </Avatar>
  ),
  args: {
    src: "",
    alt: "Avatar",
    fallback: "RO",
  },
};

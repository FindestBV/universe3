import { Meta, StoryObj } from "@storybook/react";

import { Auth } from "./Auth";

// Adjust the import path if needed

const meta: Meta<typeof Auth> = {
  title: "Components/common/utilities/Auth",
  component: Auth,
  parameters: {
    docs: {
      description: {
        component: "An authentication component with login and logout functionality.",
      },
    },
  },
  argTypes: {
    user: {
      control: "object",
      description: "The current user object.",
      defaultValue: "Ro",
    },
    onLogin: { action: "onLogin", description: "Called when the user logs in." },
    onLogout: { action: "onLogout", description: "Called when the user logs out." },
  },
};

export default meta;

type Story = StoryObj<typeof Auth>;

export const LoggedOut: Story = {
  args: {
    user: {},
  },
};

export const LoggedIn: Story = {
  args: {
    user: { name: "Ronan O'Leary" },
  },
};

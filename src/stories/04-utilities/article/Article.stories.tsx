import ArticleTest from "@/components/shared/layout/article-test";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ArticleTest> = {
  title: "Components/shared/layout/Article",
  component: ArticleTest,
  parameters: {
    docs: {
      description: {
        component:
          "A feature-rich, informational article layout showcasing sections, lists, and figure elements with embedded images and quotes.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ArticleTest>;

export const Default: Story = {
  render: () => <ArticleTest />,
  parameters: {
    docs: {
      source: {
        code: `
import { ArticleTest } from "@/components/ui/article-test";

<ArticleTest />;
        `,
      },
    },
  },
};

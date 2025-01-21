import "@/styles/universe.scss";
import type { Preview } from "@storybook/react";
import { themes } from "@storybook/theming";

const preview: Preview = {
  parameters: {
    viewport: {
      disable: true,
    },
    chromatic: {
      disableSnapshot: true,
      prefersReducedMotion: "reduce",
    },
    docs: {
      theme: themes.light,
    },
    options: {
      storySort: {
        order: [
          "Getting Started",
          [
            "Welcome",
            "Contributing",
            "Findest Glossary",
            "Changelog",
            "Migration Guides",
            ["V1 to V2"],
          ],
          "Design Foundations",
          [
            "Visual System",
            [
              "Docs",
              "Design Concept",
              "Flashlight Concept",
              "The Findest Beam",
              "The Findest Light Effect",
              "Beam Modes",
              "Infographic Highlights",
            ],
            "Colors",
            ["Brand Primary", "Supportive Colors"],
            "Typography",
            "Grid",
            "Accessibility",
            "Elevation",
            ["Overview", "*"],
            "Icons",
          ],
          "Primitives",
          ["Overview", "*"],
          "Structure",
          "Components",
          ["Overview", "ui", "shared"],
          "Utilities",
          "Testing",
          ["Technical Components", "Components"],
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

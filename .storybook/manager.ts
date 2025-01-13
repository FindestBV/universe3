import { addons } from "@storybook/manager-api";

import findestTheme from "./findestTheme";

addons.setConfig({
  theme: findestTheme,
});

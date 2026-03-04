import type { Preview } from "@storybook/react";
import "../src/styles/index.css"; // Import global styles relative to .storybook folder

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

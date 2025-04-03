import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";

// Convert `import.meta.url` to a directory path
const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return defineConfig({
    plugins: [
      react(),
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "findest",
        project: "universe3",
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "y-prosemirror": resolve(__dirname, "node_modules/y-prosemirror/dist/y-prosemirror.cjs"),
      },
    },
    optimizeDeps: {
      include: ["y-prosemirror"],
      esbuildOptions: {
        mainFields: ["module", "main"],
      },
    },
    define: {
      "process.env": env,
      global: {},
    },
    build: {
      sourcemap: true, // Source map generation must be turned on
      rollupOptions: {
        // Remove external if you want it bundled
        // external: ["y-prosemirror"],
      },
    },
  });
};

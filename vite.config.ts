import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";

// @ts-nocheck abc
export default ({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
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
      rollupOptions: {
        external: ["y-prosemirror"],
      },
    },
  });
};

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

import path from "path";

export default defineConfig({
  plugins: [react(), svgr({ include: "**/*.svg" }), tailwindcss()],
  server: {
    port: 5183,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});

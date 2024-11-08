// vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/images": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/api": {
        target: "http://127.0.0.1:5300",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  logLevel: "info",
});

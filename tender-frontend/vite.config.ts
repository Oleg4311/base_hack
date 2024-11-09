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
				target: "http://10.10.116.232:5300",
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, ""),
			},
		},
	},
	logLevel: "info",
});

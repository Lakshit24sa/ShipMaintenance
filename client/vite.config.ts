import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // "@shared": path.resolve(__dirname, "../shared"), // if shared is outside client/
      // "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  build: {
    outDir: "dist", // Vercel expects 'dist' by default
    emptyOutDir: true,
  },
});

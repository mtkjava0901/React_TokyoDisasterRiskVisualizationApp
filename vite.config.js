import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@styles": path.resolve("src/styles"),
      "@": path.resolve("src")
    }
  },
  server: {
    port: 3000
  }
});

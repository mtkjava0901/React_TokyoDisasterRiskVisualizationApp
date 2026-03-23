import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/React_TokyoDisasterRiskVisualizationApp/",
  resolve: {
    alias: {
      "@styles": path.resolve("src/styles"),
      "@": path.resolve("src")
    }
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true
      }
    }
  }
});

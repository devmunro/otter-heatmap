// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "ReactActivityHeatmap",
      fileName: (format) => `react-activity-heatmap.${format}.js`,
    },
    rollupOptions: {
      // Don't bundle react or react-dom
      external: ["react", "react-dom", "date-fns"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "date-fns": "dateFns",
        },
      },
    },
  },
});

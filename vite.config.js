import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const prefix = `monaco-editor/esm/vs`;

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/pytuga-web/" : "/",
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          editorWorker: [`${prefix}/editor/editor.worker`],
        },
      },
    },
  },
});

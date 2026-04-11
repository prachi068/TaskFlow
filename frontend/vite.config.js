import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// ✅ Correct config for deployment (Render / Netlify)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // ❌ Remove localhost proxy (only for local dev)
    // proxy: { "/api": "http://localhost:4000" },
  },
});

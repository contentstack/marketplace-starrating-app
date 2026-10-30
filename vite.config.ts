import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.spec.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.spec.{ts,tsx}", "src/**/*.d.ts", "src/common/types/**"],
      thresholds: { lines: 99, branches: 93, functions: 94, statements: 99 },
    },
  },
});

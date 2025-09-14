import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enable Jest globals like jest.fn()
    environment: "jsdom", // Use jsdom for DOM-related tests
    setupFiles: "./test/setupTests.ts", // Include setup file
    coverage: {
      provider: "v8", // Specify the coverage provider explicitly
    },
  },
});

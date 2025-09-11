import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/test/setupTests.ts"],
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html"],
      all: true,
      include: ["src/**/*.ts", "src/**/*.tsx"],
      thresholds: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
        perFile: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    },
  },
});

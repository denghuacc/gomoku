import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['test/setupTests.ts'],
    reporters: [
      [
        'default',
        {
          summary: false,
        },
      ],
    ],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/components/**/*.{ts,tsx}',
        'src/hooks/**/*.{ts,tsx}',
        'src/utils/**/*.ts',
      ],
      exclude: ['**/__tests__/**/*', 'src/test/setupTests.ts'],
    },
  },
});

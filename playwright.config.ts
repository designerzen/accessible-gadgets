import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  testIgnore: 'ios.spec.ts',
  outputDir: 'test-results/development',
  use: { baseURL: 'http://127.0.0.1:5197', headless: true },
  webServer: { command: 'pnpm dev --port 5197', url: 'http://127.0.0.1:5197', reuseExistingServer: !process.env.CI },
});

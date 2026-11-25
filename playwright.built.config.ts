import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results/production',
  testMatch: 'pages.spec.ts',
  use: { baseURL: 'http://127.0.0.1:5198/accessible-gadgets/', headless: true },
  webServer: {
    command: 'pnpm exec vite preview --host 127.0.0.1 --port 5198 --strictPort --base /accessible-gadgets/',
    url: 'http://127.0.0.1:5198/accessible-gadgets/',
    reuseExistingServer: false,
  },
});

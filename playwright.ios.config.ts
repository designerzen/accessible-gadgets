import { defineConfig, devices } from '@playwright/test';

// WebKit device emulation: this does not run Safari or VoiceOver on iOS hardware.
export default defineConfig({
  testDir: './tests',
  testMatch: ['pages.spec.ts', 'ios.spec.ts'],
  fullyParallel: true,
  workers: 2,
  outputDir: 'test-results/ios',
  use: {
    baseURL: 'http://127.0.0.1:5199/accessible-gadgets/',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'webkit-iphone', use: { ...devices['iPhone 13'], browserName: 'webkit' } },
    { name: 'webkit-ipad-landscape', use: { ...devices['iPad Mini landscape'], browserName: 'webkit' } },
  ],
  webServer: {
    command: 'pnpm exec vite preview --host 127.0.0.1 --port 5199 --strictPort --base /accessible-gadgets/',
    url: 'http://127.0.0.1:5199/accessible-gadgets/',
    reuseExistingServer: false,
  },
});

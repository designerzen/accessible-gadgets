import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      commands: {
        emulateMedia: async (
          ctx,
          options: {
            colorScheme?: 'light' | 'dark' | 'no-preference' | null;
            forcedColors?: 'active' | 'none' | null;
            reducedMotion?: 'reduce' | 'no-preference' | null;
            contrast?: 'more' | 'no-preference' | null;
          },
        ) => {
          await ctx.page.emulateMedia(options);
        },
      },
    },
  },
});

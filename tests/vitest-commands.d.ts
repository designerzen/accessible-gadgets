declare module 'vitest/internal/browser' {
  interface BrowserCommands {
    emulateMedia: (options: {
      colorScheme?: 'light' | 'dark' | 'no-preference' | null;
      forcedColors?: 'active' | 'none' | null;
      reducedMotion?: 'reduce' | 'no-preference' | null;
      contrast?: 'more' | 'no-preference' | null;
    }) => Promise<void>;
  }
}

export {};

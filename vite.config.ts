import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  // Relative assets work at the repository path, root domain, and nested pages.
  base: './',
  build: {
    rolldownOptions: {
      input: [resolve('index.html'), ...readdirSync('components').map(slug => resolve('components', slug, 'index.html'))],
    },
  },
});

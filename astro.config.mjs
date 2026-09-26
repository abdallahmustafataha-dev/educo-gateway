// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  vite: {
    // Keep classic `@media (max-width: …)` syntax in built CSS.
    // The default Lightning CSS minifier rewrites them to modern range
    // syntax `@media (width<=…)`, which older mobile browsers ignore —
    // silently dropping the entire responsive layout on phones.
    build: { cssMinify: 'esbuild' },
  },
});

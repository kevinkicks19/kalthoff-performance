// @ts-check
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: 'https://kevinkalthoff.github.io',
  base: '/KalthoffPerformance',
  output: 'static'
});

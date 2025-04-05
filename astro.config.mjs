// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import sentry from "@sentry/astro";
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap(),
    sentry({
      dsn: "YOUR_DSN_HERE",
      enabled: import.meta.env.PROD,
      sourceMapsUploadOptions: {
        project: "kalthoff-performance",
        authToken: process.env.SENTRY_AUTH_TOKEN
      }
    })
  ],
  site: 'https://kalthoffperformance.com',
  base: '',
  output: 'static'
});

// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Cambia esto por la URL final del sitio antes de desplegar (Netlify/Vercel).
  site: 'https://dosveces.example.com',
  integrations: [sitemap()],
});

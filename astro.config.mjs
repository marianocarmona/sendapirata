// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sendapirata.com/',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [partytown({ config: { forward: ['dataLayer.push'] } }), sitemap()]
});

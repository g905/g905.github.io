import { defineConfig } from 'astro/config';
import copyImagesPlugin from './copy-images-plugin.js';

export default defineConfig({
    site: 'https://g905.github.io',
    trailingSlash: 'never',
    vite: {
        plugins: [copyImagesPlugin()]
    }
});

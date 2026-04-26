import { defineConfig } from 'astro/config';

export default defineConfig({
    site: 'https://g905.ru',
    trailingSlash: 'never',
    vite: {
        css: {
            devSourcemap: true
        }
    }
});
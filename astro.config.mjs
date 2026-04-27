import { defineConfig } from 'astro/config';
import fs from 'node:fs/promises';
import path from 'node:path';

// Плагин для копирования изображений при сборке
function copyImagesPlugin() {
    let outDir;
    return {
        name: 'copy-images',
        configResolved(config) {
            outDir = config.build.client;
        },
        async closeBundle() {
            const srcImagesDir = './src/content/posts';
            const destImagesBase = path.join(outDir, 'posts');
            
            async function copyImages(dir) {
                const entries = await fs.readdir(dir, { withFileTypes: true });
                for (const entry of entries) {
                    const srcPath = path.join(dir, entry.name);
                    if (entry.isDirectory() && entry.name === 'images') {
                        const relativePath = path.relative(srcImagesDir, srcPath);
                        const destPath = path.join(destImagesBase, relativePath);
                        await fs.mkdir(destPath, { recursive: true });
                        await fs.cp(srcPath, destPath, { recursive: true });
                        console.log(`📁 Copied: ${relativePath}`);
                    } else if (entry.isDirectory()) {
                        await copyImages(srcPath);
                    }
                }
            }
            
            await copyImages(srcImagesDir);
        }
    };
}

export default defineConfig({
    site: 'https://g905.github.io',
    trailingSlash: 'never',
    vite: {
        plugins: [copyImagesPlugin()]
    }
});

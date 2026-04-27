import fs from 'node:fs/promises';
import path from 'node:path';

export default function copyImagesPlugin() {
    let outDir;
    return {
        name: 'copy-images',
        configResolved(config) {
            outDir = config.build.client;
        },
        async closeBundle() {
            const srcBase = './src/content/posts';
            const destBase = path.join(outDir, 'posts');
            
            async function copyAllImages(dir) {
                try {
                    const entries = await fs.readdir(dir, { withFileTypes: true });
                    for (const entry of entries) {
                        const srcPath = path.join(dir, entry.name);
                        if (entry.isDirectory() && entry.name === 'images') {
                            const relativePath = path.relative(srcBase, srcPath);
                            const destPath = path.join(destBase, relativePath);
                            await fs.mkdir(destPath, { recursive: true });
                            await fs.cp(srcPath, destPath, { recursive: true });
                            console.log(`📁 Copied: ${relativePath}`);
                        } else if (entry.isDirectory()) {
                            await copyAllImages(srcPath);
                        }
                    }
                } catch (err) {
                    if (err.code !== 'ENOENT') console.warn('Copy images warning:', err.message);
                }
            }
            
            await copyAllImages(srcBase);
        }
    };
}

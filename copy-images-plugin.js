import fs from 'node:fs/promises';
import path from 'node:path';

export default function copyImagesPlugin() {
    let outDir = null;
    
    return {
        name: 'copy-images',
        configResolved(config) {
            // Берём выходную директорию из конфига
            outDir = config.build.client;
            console.log(`📁 Copy-images plugin: outDir = ${outDir}`);
        },
        async writeBundle() {
            if (!outDir) {
                console.warn('⚠️ copy-images: outDir is undefined, skipping');
                return;
            }
            
            const srcBase = path.resolve(process.cwd(), 'src/content/posts');
            const destBase = path.resolve(outDir, 'posts');
            
            console.log(`📁 Copying images from ${srcBase} to ${destBase}`);
            
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
                    if (err.code !== 'ENOENT') {
                        console.warn(`⚠️ Copy images warning: ${err.message}`);
                    }
                }
            }
            
            try {
                await copyAllImages(srcBase);
            } catch (err) {
                console.warn(`⚠️ Could not copy images: ${err.message}`);
            }
        }
    };
}

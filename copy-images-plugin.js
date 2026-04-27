import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default function copyImagesPlugin() {
    let rootDir;
    let outDir;
    
    return {
        name: 'copy-images',
        async buildStart() {
            // Определяем корневую директорию проекта
            rootDir = process.cwd();
            console.log(`📁 copy-images plugin: rootDir = ${rootDir}`);
        },
        configResolved(config) {
            // Получаем выходную директорию из конфига Astro
            outDir = config.build.client;
            console.log(`📁 copy-images plugin: outDir = ${outDir}`);
        },
        async writeBundle() {
            // Защита от undefined
            if (!outDir) {
                console.warn('⚠️ copy-images: outDir is undefined, trying to resolve...');
                outDir = path.join(process.cwd(), 'dist');
            }
            
            const srcBase = path.join(process.cwd(), 'src', 'content', 'posts');
            const destBase = path.join(outDir, 'posts');
            
            console.log(`📁 Copying from ${srcBase} to ${destBase}`);
            
            // Проверяем, существует ли исходная папка
            try {
                await fs.access(srcBase);
            } catch {
                console.log(`📁 Source folder ${srcBase} does not exist, skipping`);
                return;
            }
            
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
                        console.warn(`⚠️ Copy images error: ${err.message}`);
                    }
                }
            }
            
            try {
                await copyAllImages(srcBase);
                console.log('📁 copy-images: finished');
            } catch (err) {
                console.warn(`⚠️ Could not copy images: ${err.message}`);
            }
        }
    };
}

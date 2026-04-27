import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import fs from 'node:fs/promises';
import path from 'node:path';

// Кастомный loader, который копирует папки с изображениями
function postsLoader() {
    return {
        name: 'posts-loader',
        async load() {
            // Находим все .md файлы
            const files = await glob({ pattern: '**/*.md', base: './src/content/posts/' }).load();
            
            // Для каждого файла копируем папку images в dist
            for (const file of files) {
                const postDir = path.dirname(file.path);
                const imagesDir = path.join('./src/content/posts', postDir, 'images');
                const distImagesDir = path.join('./dist', 'posts', postDir, 'images');
                
                try {
                    await fs.access(imagesDir);
                    // Папка images существует — копируем
                    await fs.mkdir(distImagesDir, { recursive: true });
                    await fs.cp(imagesDir, distImagesDir, { recursive: true });
                    console.log(`📁 Copied images for post: ${postDir}`);
                } catch {
                    // Нет папки images — ничего не делаем
                }
            }
            
            return files;
        }
    };
}

const posts = defineCollection({
    loader: postsLoader(),
    schema: z.object({
        title: z.string(),
        date: z.string(),
        excerpt: z.string().optional(),
    }),
});

export const collections = { posts };

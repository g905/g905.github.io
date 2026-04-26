import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
    // Загружаем все .md файлы из папки src/content/posts/
    loader: glob({ pattern: "**/*.md", base: "./src/content/posts/" }),
    schema: z.object({
        title: z.string(),
        date: z.string(),
        excerpt: z.string().optional(),
    }),
});

export const collections = { posts };

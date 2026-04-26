import { z, defineCollection } from 'astro:content';

const postsCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        date: z.string(),
        excerpt: z.string().optional(),
    }),
});

export const collections = {
    'posts': postsCollection,
};

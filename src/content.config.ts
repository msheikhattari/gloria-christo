import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Concordance: KJV verse-lists for a single keyword. Mostly mechanical.
const concordance = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/concordance' }),
  schema: z.object({}).passthrough(),
});

// Practices: operational disciplines.
const practices = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/practices' }),
  schema: z.object({}).passthrough(),
});

// Texts: close-reading analyses of specific passages.
const texts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/texts' }),
  schema: z.object({}).passthrough(),
});

export const collections = { concordance, practices, texts };

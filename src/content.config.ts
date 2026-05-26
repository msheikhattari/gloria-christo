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

// Texts: close-readings + themes. Rich frontmatter enables multiple views.
const texts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/texts' }),
  schema: z
    .object({
      type: z.enum(['verse', 'narrative', 'theme']).optional(),
      book: z.string().optional(),
      chapter: z.number().optional(),
      verse: z.union([z.number(), z.string()]).optional(),
      testament: z.enum(['OT', 'NT']).optional(),
      genre: z
        .enum([
          'torah',
          'historical',
          'wisdom',
          'psalms',
          'prophets',
          'gospels',
          'epistles',
          'revelation',
        ])
        .optional(),
      themes: z.array(z.string()).default([]),
      related_themes: z.array(z.string()).default([]),
      related_practices: z.array(z.string()).default([]),
      title_short: z.string().optional(),
    })
    .passthrough(),
});

export const collections = { concordance, practices, texts };

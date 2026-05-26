// Helpers for working with the texts collection — used by index pages,
// theme aggregators, book browsers.

import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type TextEntry = CollectionEntry<'texts'>;

// Canonical Bible book ordering for browse-by-book.
export const BIBLE_ORDER: string[] = [
  // Torah
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  // Historical
  'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings',
  '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther',
  // Wisdom
  'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
  // Prophets
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
  'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah',
  'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  // Gospels + Acts
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  // Epistles
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon',
  'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation',
];

export function bookIndex(book: string | undefined): number {
  if (!book) return 999;
  const i = BIBLE_ORDER.indexOf(book);
  return i === -1 ? 999 : i;
}

export function bookSlug(book: string): string {
  return book.toLowerCase().replace(/\s+/g, '-');
}

export function slugOf(entry: TextEntry): string {
  return entry.id.replace(/\.md$/, '');
}

export function titleOf(entry: TextEntry): string {
  // Prefer first H1 from body; fall back to id
  const m = entry.body?.match(/^#\s+(.+)$/m);
  return m?.[1].trim() ?? entry.id;
}

export async function allTexts(): Promise<TextEntry[]> {
  const entries = await getCollection('texts');
  return entries.filter(
    (e) => e.id.toLowerCase().replace(/\.md$/, '') !== 'readme'
  );
}

export function byType(entries: TextEntry[], type: 'verse' | 'narrative' | 'theme'): TextEntry[] {
  return entries.filter((e) => e.data.type === type);
}

export function sortByBook(entries: TextEntry[]): TextEntry[] {
  return [...entries].sort((a, b) => {
    const bi = bookIndex(a.data.book) - bookIndex(b.data.book);
    if (bi !== 0) return bi;
    const ca = a.data.chapter ?? 0;
    const cb = b.data.chapter ?? 0;
    if (ca !== cb) return ca - cb;
    // verse can be number or "17-19" string — try numeric first
    const va = typeof a.data.verse === 'number' ? a.data.verse : parseInt(String(a.data.verse ?? '0'), 10);
    const vb = typeof b.data.verse === 'number' ? b.data.verse : parseInt(String(b.data.verse ?? '0'), 10);
    return va - vb;
  });
}

export function sortByTitle(entries: TextEntry[]): TextEntry[] {
  return [...entries].sort((a, b) => titleOf(a).localeCompare(titleOf(b)));
}

export function allThemes(entries: TextEntry[]): string[] {
  const set = new Set<string>();
  entries.forEach((e) => (e.data.themes ?? []).forEach((t) => set.add(t)));
  // Also include theme files themselves (their slug acts as a theme name)
  entries.forEach((e) => {
    if (e.data.type === 'theme') set.add(slugOf(e));
  });
  return Array.from(set).sort();
}

export function allBooks(entries: TextEntry[]): string[] {
  const set = new Set<string>();
  entries.forEach((e) => {
    if (e.data.book) set.add(e.data.book);
  });
  return Array.from(set).sort((a, b) => bookIndex(a) - bookIndex(b));
}

export function entriesByTheme(entries: TextEntry[], theme: string): TextEntry[] {
  return entries.filter((e) => {
    if (e.data.type === 'theme' && slugOf(e) === theme) return true;
    return (e.data.themes ?? []).includes(theme);
  });
}

export function entriesByBook(entries: TextEntry[], book: string): TextEntry[] {
  return entries.filter((e) => e.data.book === book);
}

export function typeLabel(type: string | undefined): string {
  switch (type) {
    case 'verse':
      return 'Close reading';
    case 'narrative':
      return 'Narrative arc';
    case 'theme':
      return 'Theme';
    default:
      return '';
  }
}

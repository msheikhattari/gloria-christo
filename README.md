# gloria-christo

A personalized scripture-study skeleton. Generic core (KJV + Brenton LXX + a four-frame reading methodology); per-user overlay (your chosen teacher, your analyses, your practice cycles). Anyone can inhabit it.

> *"Let not the foot of pride come against me, and let not the hand of the wicked remove me."* — Psalm 36:11

## What this is

Not a Bible website. Not a content product. A **method-as-product, content-as-scaffolding** offering.

The repository ships with a small body of universal content — a 64-keyword KJV concordance, five operational scripture-study practices, and a few close-reading analyses of specific passages. What's transferable is not the specific content but the *way of working* with scripture across multiple reading frames at once: LXX/Greek, Masoretic/Hebrew, patristic commentary, and a chosen contemporary teacher.

Phase 0 (this folder) is a static read-only library. Later phases add per-user accounts, AI-assisted analysis on any verse, teacher uploads with RAG, and personal practice cycles. See `phases.md` (forthcoming) for the build plan.

## Browse

- **[`content/concordance/`](./content/concordance/)** — 64 KJV keyword verse-lists (every passage on love, faith, prayer, law, humility, pride, etc.)
- **[`content/practices/`](./content/practices/)** — five operational disciplines (memorization, chanting, praying scripture, praying for humility)
- **[`content/texts/`](./content/texts/)** — close readings of specific passages (Hebrew + Greek where it serves the practice)

## Six commitments

These are load-bearing. The project is shaped by them, not the other way around.

1. **Anonymous.** No author byline, no photo, no bio. The work is the offering; the receipt is not required.
2. **Open source.** MIT-licensed. Forkable, cloneable, self-hostable.
3. **Unpaid.** No monetization. No premium tier. No ads. No engagement metrics.
4. **Unkillable.** Static-first; runs on any host or no host. Content in plain markdown — portable forever. Code permissive-licensed — forkable forever. The central instance can disappear; the work continues wherever someone keeps a copy running.
5. **AI as calculator, human soul operates it.** Future AI features (per-user, opt-in) are mechanical: they look up, cross-reference, distill, embed. They do not direct, counsel, or guide. Spiritual transformation is between you and what you're reading.
6. **Bring your own API key.** When AI features are added, you provide your own Anthropic/OpenAI/etc. key. No central billing. No central logging. Your study is private.

## Self-host

Static Phase 0 in under 10 minutes:

```bash
git clone https://github.com/<org>/gloria-christo
cd gloria-christo
# Serve content/ via any static host:
python3 -m http.server --directory content
# Or build with Astro (forthcoming):
# pnpm install && pnpm build && pnpm preview
```

See `SELFHOST.md` (forthcoming) for details on Phase 1+ self-hosting with auth + AI + user uploads.

## Public-domain texts

- **King James Version** (1769 standard text)
- **Brenton's English Septuagint** (1851 — Sir Lancelot Charles Lee Brenton)

Verse extraction is regex-based against a clean parsed text. The regex used appears in each concordance file's header for reproducibility.

## License

MIT. See [`LICENSE`](./LICENSE).

# Self-hosting gloria-christo

The project is designed to be self-hosted trivially. The central instance is one of potentially many; you can run your own with no permissions, no payment, no account.

## Phase 0 (current): static read-only library

The fastest path. No backend, no auth, no AI. Just markdown.

```bash
git clone https://github.com/<org>/gloria-christo
cd gloria-christo

# Option A: serve raw markdown via any static host
python3 -m http.server --directory content
# Visit http://localhost:8000

# Option B: serve via Astro (forthcoming, when scaffold is added)
# pnpm install
# pnpm build
# pnpm preview
```

Total time: under 5 minutes. No dependencies on the publisher's hosted instance.

## Phase 1+ (forthcoming): full self-host with auth + AI

When later phases ship, full self-host will require:
- A static host (Cloudflare Pages, Netlify, Vercel, or your own server)
- A Supabase instance (free tier is sufficient; or self-host Supabase via Docker)
- Cloudflare Workers (or any serverless function platform) for the AI proxy
- An Anthropic API key (yours — never the publisher's)

Detailed instructions will live here when those phases ship.

## Why self-host?

Three reasons, in order:

1. **Privacy.** Your scripture study is between you and the model. Self-hosting removes any third-party server from the picture.
2. **Resilience.** If the publisher's hosted instance goes down, you keep working.
3. **Sovereignty.** The code is yours to modify, extend, fork, and redeploy as you see fit. No upstream control.

## Forking and modifying

The content and code are MIT-licensed. Fork freely. If you fork and improve, no contribution back is required — but pull requests are welcome on the canonical repo.

If you want to publish your own modified version with a different name (different domain, different bias, different curated practices), please do. The mission is served by more instances, not by one.

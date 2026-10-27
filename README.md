# Resume Builder

AI-assisted resume builder with 10 templates (6 ATS-friendly) and pixel-perfect A4 PDF export.
No accounts and no database: everything is stored in the user's browser (`localStorage`), with
JSON backup/restore from the editor menu.

## Features

- **Templates**: live previews, free to switch at any time; content carries over.
- **AI** (Groq, server-side key; default model `openai/gpt-oss-120b`):
  - write or rewrite the professional summary (optionally tailored to a job post)
  - turn rough job notes into achievement bullets
  - suggest skills from your experience
  - job match: ATS score, matched and missing keywords, concrete fixes
  - import an existing resume / LinkedIn profile from pasted text
  - career assistant chat that knows your current resume
- **PDF export**: the preview is rendered at true A4 width, and the exact same HTML is printed by
  headless Chromium, so the PDF matches the preview and contains real, selectable text (ATS-readable).
  Entries are kept from splitting across pages. If the renderer is unavailable, the app falls back
  to the browser's own print-to-PDF on an isolated copy of the page. PNG export is also available.
- **Reorder everything**: move whole sections (summary, experience, education, skills, additional
  sections) up or down and the resume follows in every template; reorder entries inside each section;
  drag skills (or Alt+←/→) to reorder them.
- Undo/redo (Ctrl+Z / Ctrl+Shift+Z), autosave, photo upload (resized client-side).

## Setup

```bash
npm install
cp .env.example .env.local   # then add GROQ_API_KEY
npm run dev
```

The app works without a key; only the AI buttons will report that AI isn't configured.

### PDF export locally

Uses your installed Chrome or Edge (auto-detected on Windows, macOS and Linux). Set
`CHROME_EXECUTABLE_PATH` if it isn't found.

## Deploy

- **Vercel / Netlify / AWS Lambda**: works as is. On serverless Linux the export route uses
  `@sparticuz/chromium`; `next.config.mjs` ships its binary with the `/api/export` function.
  Set `GROQ_API_KEY` in the project's environment variables (and the Upstash variables, see below).
- **Docker / VPS**: install Chromium in the image (or set `CHROME_EXECUTABLE_PATH`).

Keep `puppeteer-core` and `@sparticuz/chromium` on matching Chrome versions when upgrading
(currently both target Chrome 148).

## Security notes

- The Groq key is only read on the server (`lib/ai.ts`).
- `/api/export` renders user-supplied HTML with JavaScript disabled and blocks every network request
  except Google Fonts, so it can't be used to reach internal URLs.
- **Rate limiting**: AI requests are limited per visitor IP (default 8/minute and 100/day) plus an
  app-wide cap (60/minute) so many IPs together can't drain the Groq quota; exports are limited to
  10/minute and 200/day. Blocked requests get a 429 with `Retry-After`, and the browser stops sending
  AI calls until the wait is over. Tune the limits with the variables in `.env.example`.
  Counts are in memory unless `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set. On
  serverless each instance has its own memory, so add a free Upstash Redis database there.

## Scripts

`npm run dev` · `npm run build` · `npm start` · `npm run typecheck`

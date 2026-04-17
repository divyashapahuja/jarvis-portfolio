# JARVIS Portfolio

Scroll-driven developer portfolio built with Next.js App Router and a futuristic HUD-style UI.

## Stack

- Next.js 16 (App Router + Turbopack for `next dev`)
- React + TypeScript
- Tailwind CSS
- GSAP + ScrollTrigger
- Lenis (smooth scroll via `src/components/SmoothScroll.tsx`)
- Gemini API (`@google/generative-ai`) for the optional chat assistant (`src/app/api/chat/route.ts`)

## Key Features

- Holographic project carousel in `src/components/ProjectsSection.tsx`
- Dedicated case-study pages at `src/app/projects/[id]/page.tsx`
- Multi-section landing flow (hero, projects, experience, education, contact)
- Custom cursor mounted globally from `src/app/layout.tsx`
- Floating **Gemini-powered** chat UI (`src/components/ChatBot.tsx`) backed by `POST /api/chat`
- HUD-inspired education section with GPA dial + connector styling
- Hash-based return navigation from project details:
  - Back to Projects returns to the same project centered
  - All Projects returns to the first project (Alpha) centered

## Environment variables

The chat assistant needs a Google Gemini API key on the **server** (never exposed to the browser, never committed).

1. Create `.env.local` in the project root (already gitignored).
2. Add:

   ```bash
   GEMINI_API_KEY=your_key_here
   # Optional: override model if you hit 429 / quota on the default (see note below)
   # GEMINI_MODEL=gemini-1.5-flash
   ```

3. Get a key from [Google AI Studio](https://aistudio.google.com/apikey).
4. For production (e.g. Vercel), add the same variable in the host’s environment settings.

If `GEMINI_API_KEY` is missing, `/api/chat` returns an error and the bot will not be able to reply.

### Gemini 429 “quota” on the first message (free tier)

You can use the **free tier** with a key from [Google AI Studio](https://aistudio.google.com/apikey) **without** adding a card or linking Cloud billing. A **429** still sometimes appears on early calls; it usually reflects **rate limits, per-model limits, or project/API setup**, not “you used the paid tier wrong.”

Things to try:

1. Confirm the **Generative Language API** (Gemini API) is enabled for the Google Cloud project tied to the key (AI Studio / Cloud Console).
2. Check [usage and rate limits](https://aistudio.google.com/) for that project.
3. Create a **new API key** in AI Studio and update Vercel, then **redeploy** (and match **Production vs Preview** env scope to the URL you test).
4. Try another model via env: set **`GEMINI_MODEL`** to e.g. `gemini-1.5-flash` or `gemini-2.0-flash-001` (defaults to **`gemini-2.0-flash`** if unset).

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npm start
```

## Project Structure

- `src/app/page.tsx` - homepage section composition and hash scroll handling
- `src/app/projects/[id]/page.tsx` - project detail route
- `src/app/api/chat/route.ts` - Gemini proxy for the chat panel
- `src/lib/projects.ts` - project, experience, education, contact data
- `src/components/` - visual sections and shared UI components
- `docs/plans/portfolio-from-scratch-blueprint.plan.md` — blueprint lives in `docs/plans/` (not the gitignored `/plans/` at repo root)

## Notes

- This project expects modern browsers with JavaScript enabled.
- **Responsive layout:** primary breakpoint is Tailwind **`lg` (1024px)**. Below that: slide-out nav, stacked hero / scanner bios, single-card projects carousel, left-rail experience timeline, sticky phase chips on case-study pages, native cursor + larger tap targets. The holographic three-card stage and desktop HUD orbit layout apply from `lg` and up.
- If your repo remote was moved, update your local remote URL before future pushes.

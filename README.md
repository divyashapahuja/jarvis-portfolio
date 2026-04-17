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
   ```

3. Get a key from [Google AI Studio](https://aistudio.google.com/apikey).
4. For production (e.g. Vercel), add the same variable in the host’s environment settings.

If `GEMINI_API_KEY` is missing, `/api/chat` returns an error and the bot will not be able to reply.

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
- `docs/plans/portfolio-from-scratch-blueprint.plan.md` - rebuild / agent-oriented blueprint

## Notes

- This project expects modern browsers with JavaScript enabled.
- **Responsive layout:** primary breakpoint is Tailwind **`lg` (1024px)**. Below that: slide-out nav, stacked hero / scanner bios, single-card projects carousel, left-rail experience timeline, sticky phase chips on case-study pages, native cursor + larger tap targets. The holographic three-card stage and desktop HUD orbit layout apply from `lg` and up.
- If your repo remote was moved, update your local remote URL before future pushes.

# JARVIS Portfolio

Scroll-driven developer portfolio built with Next.js App Router and a futuristic HUD-style UI.

## Stack

- Next.js 16 (App Router + Turbopack)
- React + TypeScript
- Tailwind CSS
- GSAP + ScrollTrigger

## Key Features

- Holographic project carousel in `src/components/ProjectsSection.tsx`
- Dedicated case-study pages at `src/app/projects/[id]/page.tsx`
- Multi-section landing flow (hero, projects, experience, education, contact)
- Custom cursor mounted globally from `src/app/layout.tsx`
- HUD-inspired education section with GPA dial + connector styling
- Hash-based return navigation from project details:
  - Back to Projects returns to the same project centered
  - All Projects returns to the first project (Alpha) centered

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
- `src/lib/projects.ts` - project, experience, education, contact data
- `src/components/` - visual sections and shared UI components

## Notes

- This project expects modern browsers with JavaScript enabled.
- If your repo remote was moved, update your local remote URL before future pushes.

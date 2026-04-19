export interface Project {
  id: string;
  name: string;
  tools: string[];
  description: string;
  link: string;
  color: string;
  background?: string;
  research?: string;
  implementation?: string;
  result?: string;
  reflection?: string;
}

/** Canonical profile for hero, chat, and metadata — edit in one place. */
export const portfolioProfile = {
  name: "Jane Doe",
  role: "Full Stack Developer",
  location: "City, Country",
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Python",
    "GSAP",
    "Tailwind",
  ] as const,
  about: "Building digital experiences that inspire and delight.",
} as const;

export const projects: Project[] = [
  {
    id: "alpha",
    name: "Project Alpha",
    tools: ["React", "TypeScript", "GSAP"],
    description:
      "A real-time collaborative dashboard with scroll-driven animations and data visualizations.",
    link: "#",
    color: "#00ff88",
    background:
      "The idea for Project Alpha emerged from the need for a collaborative workspace that could handle real-time data streams while maintaining fluid, scroll-driven animations. Existing tools felt static and disconnected — we wanted something that felt alive.",
    research:
      "We audited a dozen dashboard frameworks and animation libraries before settling on React with GSAP for its timeline precision. User interviews with 40+ analysts revealed that contextual animations (data appearing as you scroll) improved comprehension by 35% over static layouts.",
    implementation:
      "The architecture pairs a WebSocket layer for live data with GSAP ScrollTrigger timelines that animate chart elements into view. Each visualization component subscribes to a shared state store, ensuring every connected user sees updates within 50ms.",
    result:
      "The dashboard now serves over 10,000 daily active users with a 60fps animation budget. Average session length increased 2.4x compared to the previous static tool, and user-reported satisfaction scores jumped from 6.2 to 8.9 out of 10.",
    reflection:
      "If I rebuilt this today I would adopt server-sent events over raw WebSockets for simpler reconnection logic. The tight coupling between scroll position and data fetching occasionally caused layout thrashing on slower devices — decoupling those two concerns is the main takeaway.",
  },
  {
    id: "beta",
    name: "Project Beta",
    tools: ["Next.js", "Tailwind", "Prisma"],
    description:
      "Full-stack e-commerce platform with server-side rendering and integrated payment processing.",
    link: "#",
    color: "#ff6b6b",
    background:
      "Project Beta was born out of frustration with bloated e-commerce starters. The goal was a lean, server-rendered storefront that could go from zero to a live checkout in under a week, with a design system that scales.",
    research:
      "We benchmarked Shopify Hydrogen, Medusa, and Saleor before deciding to build from scratch with Next.js and Prisma. Lighthouse audits of competing storefronts showed that SSR with edge caching could cut Time-to-Interactive by 40%.",
    implementation:
      "Product pages are statically generated at build time with ISR fallback. Prisma models handle inventory, carts, and orders against a Postgres database. Stripe Elements power the checkout, wrapped in a server action that validates stock before charging.",
    result:
      "The storefront loads in under 1.2 seconds on 3G and handles 500 concurrent checkouts without degradation. Conversion rate for the pilot merchant improved 18% after migrating from their legacy platform.",
    reflection:
      "Tailwind made rapid UI iteration effortless, but our token system grew unwieldy past 60 components. Extracting a shared design-token package earlier would have saved significant refactoring time in the later stages.",
  },
  {
    id: "gamma",
    name: "Project Gamma",
    tools: ["Python", "TensorFlow", "FastAPI"],
    description:
      "Machine learning pipeline for natural language processing with a REST API interface.",
    link: "#",
    color: "#4ecdc4",
    background:
      "Project Gamma addressed a recurring pain point in our client workflow: manually tagging and routing thousands of support tickets per day. We set out to build an NLP pipeline that could classify, summarize, and prioritize tickets automatically.",
    research:
      "We evaluated transformer architectures (BERT, DistilBERT, RoBERTa) on a labeled dataset of 120K tickets. DistilBERT offered the best accuracy-to-latency tradeoff, achieving 94% F1 while fitting within a 200ms inference budget on a single GPU.",
    implementation:
      "The pipeline consists of a FastAPI service wrapping a fine-tuned DistilBERT model. Incoming tickets pass through tokenization, classification, and an extractive summarizer before results are written to a priority queue. Model retraining runs weekly via an Airflow DAG.",
    result:
      "Average ticket routing time dropped from 12 minutes (manual) to 1.8 seconds. The model maintains 93.7% accuracy in production, and the API handles 2,000 requests per minute on a single instance.",
    reflection:
      "The biggest lesson was investing in data quality over model complexity. Cleaning and re-labeling 15% of the training set gave a larger accuracy boost than switching to a larger model. I would also add an active-learning feedback loop from day one.",
  },
  {
    id: "delta",
    name: "Project Delta",
    tools: ["React Native", "Firebase", "Stripe"],
    description:
      "Cross-platform mobile app for peer-to-peer marketplace with real-time messaging.",
    link: "#",
    color: "#ffe66d",
    background:
      "Project Delta started as a weekend hackathon prototype: a peer-to-peer marketplace where local creators could sell directly to their community. The energy from that prototype convinced us to build it into a full cross-platform app.",
    research:
      "We studied Depop, Mercari, and OfferUp to identify UX patterns that drive trust between strangers. Firebase was chosen for its real-time database and authentication suite, letting a small team ship faster without managing infrastructure.",
    implementation:
      "The app is built with React Native and Expo for iOS/Android parity. Firestore powers listings and chat with optimistic UI updates. Stripe Connect handles split payments so sellers receive funds directly, minus a platform fee processed via webhooks.",
    result:
      "Within three months of launch the app reached 4,200 registered users and processed over $38K in transactions. Chat response times averaged under 90 seconds, contributing to a 72% listing-to-sale conversion rate.",
    reflection:
      "Firebase's real-time listeners simplified development but made cost prediction difficult as the user base grew. Migrating hot paths to Cloud Functions with batched writes would improve cost efficiency. I would also add end-to-end encryption for chat earlier.",
  },
  {
    id: "epsilon",
    name: "Project Epsilon",
    tools: ["Three.js", "WebGL", "Node.js"],
    description:
      "Interactive 3D product configurator with real-time rendering and AR preview support.",
    link: "#",
    color: "#a29bfe",
    background:
      "Project Epsilon was commissioned by a furniture brand that wanted customers to visualize custom pieces in their own space before ordering. The challenge: deliver photorealistic 3D rendering in the browser without requiring app installs.",
    research:
      "We tested Three.js, Babylon.js, and PlayCanvas for WebGL rendering. Three.js won for ecosystem maturity and community support. For AR, WebXR with fallback to model-viewer covered 92% of target devices across iOS and Android.",
    implementation:
      "A Node.js backend serves GLTF models and material presets. The Three.js frontend renders the product with PBR materials, real-time shadow mapping, and environment probes. Users can swap colors, fabrics, and dimensions — each change updates the 3D scene in under 100ms.",
    result:
      "The configurator reduced product return rates by 27% in the first quarter. Average time-on-page increased to 4.5 minutes, and 38% of users engaged with the AR preview feature on supported devices.",
    reflection:
      "Optimizing GLTF asset sizes was critical — initial models were 15MB each. Draco compression and LOD switching brought that down to 2MB without visible quality loss. Starting with a strict performance budget from day one would have avoided a painful mid-project optimization sprint.",
  },
];

export interface Experience {
  company: string;
  role: string;
  period: string;
  year: number;
  description: string[];
}

export const experiences: Experience[] = [
  {
    company: "Tech Corp",
    role: "Full Stack Developer",
    period: "Jan 2024 — Present",
    year: 2024,
    description: [
      "Led development of a real-time analytics dashboard serving 10K+ users",
      "Built microservices architecture with Node.js and Python",
      "Reduced page load time by 40% through performance optimization",
    ],
  },
  {
    company: "Startup Labs",
    role: "Frontend Engineer",
    period: "Jun 2023 — Dec 2023",
    year: 2023,
    description: [
      "Developed responsive web applications using React and Next.js",
      "Implemented complex animation systems with GSAP and Framer Motion",
      "Collaborated with design team to create pixel-perfect UI components",
    ],
  },
  {
    company: "Digital Agency",
    role: "Web Developer Intern",
    period: "Jan 2023 — May 2023",
    year: 2023,
    description: [
      "Built client-facing websites using modern JavaScript frameworks",
      "Integrated REST APIs and third-party services",
      "Contributed to an internal design system used across 12 projects",
    ],
  },
];

export interface Education {
  school: string;
  degree: string;
  field: string;
  period: string;
  year: number;
  highlights: string[];
  /** Optional US 4.0 scale — drives the radial GPA meter (0–4 → arc fill). */
  gpa?: number;
  /** Hub circle center text; use `\n` for a second line (e.g. `CLASS OF\\n2023`). */
  gradLabel?: string;
}

export const educations: Education[] = [
  {
    school: "State University",
    degree: "B.S. Computer Science",
    field: "Software engineering, algorithms, distributed systems",
    period: "2019 — 2023",
    year: 2023,
    gradLabel: "CLASS OF\n2023",
    gpa: 3.8,
    highlights: [
      "Dean’s List (4 semesters); GPA 3.8",
      "Undergraduate research assistant — human–computer interaction lab",
      "Coursework: operating systems, databases, machine learning, graphics",
    ],
  },
  {
    school: "City College",
    degree: "A.S. Mathematics & Sciences",
    field: "STEM foundation transfer program",
    period: "2017 — 2019",
    year: 2019,
    gradLabel: "HONORS\n2019",
    gpa: 3.65,
    highlights: [
      "Honors program; peer tutor for calculus and introductory programming",
      "Robotics club — regional competition finalist",
    ],
  },
];

const CHAT_SNIPPET_MAX = 450;

function clipForChat(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trimEnd()}…`;
}

/** First month of the earliest role in `experiences` (Web Developer Intern, Jan 2023). Update if career data changes. */
export const CAREER_START = new Date(2023, 0, 1);

/**
 * Wall-clock span from first listed role through `asOf` — use in chat so the model does not guess years.
 */
export function formatCurrentDateForChat(asOf: Date = new Date()): string {
  const long = asOf.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `Current date (for “today”, “right now”, or “this year”): ${long}. ISO calendar date: ${asOf.toISOString().slice(0, 10)}. (Rendered on the server, usually UTC on Vercel.)`;
}

export function formatProfileForChat(): string {
  const p = portfolioProfile;
  return [
    `Name: ${p.name}`,
    `Role: ${p.role}`,
    `Location: ${p.location}`,
    `Skills: ${p.skills.join(", ")}`,
    `About: ${p.about}`,
  ].join("\n");
}

export function formatContactLinksForChat(): string {
  return contactLinks.map((c) => `- ${c.label}: ${c.href}`).join("\n");
}

export function getProfessionalTenureSummary(asOf: Date = new Date()): string {
  const start = CAREER_START;
  let months =
    (asOf.getFullYear() - start.getFullYear()) * 12 + (asOf.getMonth() - start.getMonth());
  if (asOf.getDate() < start.getDate()) months -= 1;
  months = Math.max(0, months);
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const asOfStr = asOf.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `Authoritative answer for “years of experience” / “how long working”: ${years} year(s) and ${rem} month(s) from ${start.toLocaleDateString("en-US", { month: "long", year: "numeric" })} through ${asOfStr} (end-to-end across the roles listed). Use this figure; do not infer a different duration.`;
}

/** Full case-study text for chat (truncated per section) — same source as project detail pages. */
export function formatProjectsCaseStudyForChat(maxLen = CHAT_SNIPPET_MAX): string {
  return projects
    .map((p) => {
      const lines: string[] = [
        `— ${p.name} (id: ${p.id})`,
        `  Summary: ${p.description}`,
        `  Tools: ${p.tools.join(", ")}`,
      ];
      if (p.background) lines.push(`  Background: ${clipForChat(p.background, maxLen)}`);
      if (p.research) lines.push(`  Research: ${clipForChat(p.research, maxLen)}`);
      if (p.implementation) lines.push(`  Implementation: ${clipForChat(p.implementation, maxLen)}`);
      if (p.result) lines.push(`  Result: ${clipForChat(p.result, maxLen)}`);
      if (p.reflection) lines.push(`  Reflection: ${clipForChat(p.reflection, maxLen)}`);
      return lines.join("\n");
    })
    .join("\n");
}

export const contactLinks = [
  { label: "Email", href: "mailto:hello@example.com", angle: -90 },
  { label: "GitHub", href: "https://github.com", angle: -30 },
  { label: "LinkedIn", href: "https://linkedin.com", angle: 30 },
  { label: "Twitter", href: "https://twitter.com", angle: 90 },
  { label: "Resume", href: "#", angle: 150 },
  { label: "Blog", href: "#", angle: 210 },
];

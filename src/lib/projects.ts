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
  name: "Divyasha Pahuja",
  role: "AI / ML Engineer",
  location: "Toronto, ON",
  skills: [
    "Python",
    "PyTorch",
    "TensorFlow",
    "LangChain",
    "NLP",
    "Computer Vision",
    "SQL",
    "FastAPI",
  ] as const,
  about:
    "Machine learning and AI engineer with a software engineering foundation, 3+ years of industry experience, and an M.S. in Computer Science. I build ML systems spanning NLP and computer vision, Gen AI workflows, LLM orchestration, and model–data integration.",
} as const;

/** Navbar brand (e.g. D.PAHUJA) — derived from `portfolioProfile.name`. */
export function portfolioNavMonogram(): string {
  const parts = portfolioProfile.name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const first = parts[0]!.charAt(0).toUpperCase();
    const last = parts[parts.length - 1]!.toUpperCase();
    return `${first}.${last}`;
  }
  return portfolioProfile.name.toUpperCase().slice(0, 8);
}

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
    company: "Techneto Corp. · Mesa, US",
    role: "AI/ML Researcher",
    period: "Jul 2025 — Dec 2025",
    year: 2025,
    description: [
      "Led research on diffusion-based architectures as alternatives to transformer LLMs to improve generative efficiency.",
      "Evaluated and calibrated 3+ masked diffusion transformer models for text, audio, and streaming data.",
      "Applied statistical losses (KL divergence, cross-entropy) to optimize training and improve model stability.",
    ],
  },
  {
    company: "University of Illinois Chicago",
    role: "Research Assistant",
    period: "Sep 2024 — Jul 2025",
    year: 2024,
    description: [
      "Directed a healthcare informatics study on ADHD detection using multimodal ML (language, neuroimaging, and other modalities).",
      "Follow-up work characterizing evolving longitudinal language patterns in neuroatypical individuals during a conversational social-skills performance assessment.",
    ],
  },
  {
    company: "Newgen Software Technologies Limited · Noida, IN",
    role: "Software Engineer",
    period: "Jul 2019 — Jul 2022",
    year: 2019,
    description: [
      "Michael’s Stores: orchestrated optimization of 25+ ETL pipelines (18% faster processing); PySpark for large-scale workloads (28% runtime reduction vs legacy); Advanced Java RF screens for WMS integration.",
      "P&G: automated data workflows in Python; FastAPI REST services for internal ML/data pipelines (30% less manual processing); Git-based deployments through SDLC (DEV, UAT, production).",
      "Americold: SQL/MOCA query optimization (28% faster retrieval on 500k+ record datasets); documentation for client adoption.",
    ],
  },
  {
    company: "Newgen Software Technologies Limited · Noida, IN",
    role: "Software Trainee",
    period: "Feb 2019 — Jun 2019",
    year: 2019,
    description: [
      "AAFES: advanced SQL for warehouse management; ~20% efficiency gains on 100k+ entry datasets; JDA 2020 front-end integration with backend systems.",
    ],
  },
  {
    company: "Federation of Indian Chambers of Commerce and Industry · New Delhi, IN",
    role: "Software Intern",
    period: "Jun 2018 — Jul 2018",
    year: 2018,
    description: [
      "Built HR-facing applications that removed manual workflows and improved operational efficiency by 45%.",
      "Designed a relational schema in Microsoft SQL Server and shipped a C#/.NET application that reduced processing time by 12%.",
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
    school: "University of Illinois Chicago (UIC)",
    degree: "M.S. Computer Science",
    field: "Machine learning, NLP, multimodal modeling, and applied AI research.",
    period: "May 2024",
    year: 2024,
    gradLabel: "M.S.\n2024",
    gpa: 3.88,
    highlights: [
      "Graduate GPA 3.88 / 4.0",
      "Research assistant — healthcare informatics and longitudinal language modeling",
    ],
  },
  {
    school: "Guru Gobind Singh Indraprastha University (GGSIPU)",
    degree: "B.Tech Computer Science and Engineering",
    field: "Software engineering, algorithms, and systems fundamentals — New Delhi, India.",
    period: "Jun 2019",
    year: 2019,
    gradLabel: "B.TECH\n2019",
    highlights: ["GPA 8.25 / 10.0"],
  },
];

export interface Publication {
  id: string;
  year: number;
  title: string;
  venue: string;
  dateLabel: string;
  contribution: string;
  /** Publisher, DOI, or Scholar search — opens in a new tab */
  href?: string;
}

export const publications: Publication[] = [
  {
    id: "benford-covid",
    year: 2022,
    title:
      "Application of Benford’s Law to Detect if COVID-19 Data is under Reported or Manipulated",
    venue: "New Frontiers in Communication and Intelligent Systems (Springer)",
    dateLabel: "Feb 2022",
    contribution:
      "Implemented an SEIR-style epidemic model adapted for COVID-19 parameters and Benford’s Law analyses to assess data integrity across countries.",
    href: "https://scholar.google.com/scholar?q=Application+of+Benford%27s+Law+COVID-19+Divyasha+Pahuja",
  },
  {
    id: "music-emotion",
    year: 2022,
    title: "Music Emotion Recognition using Neural Networks",
    venue: "Proceedings of the Third ICCCES, Springer LNEE",
    dateLabel: "Feb 2022",
    contribution:
      "Hyperparameter-tuned CNN on spectrograms for genre/emotion prediction; compared optimizers and learning rates (10⁻², 10⁻³, 10⁻⁴) and reported findings.",
    href: "https://scholar.google.com/scholar?q=Music+Emotion+Recognition+Neural+Networks+Divyasha+Pahuja",
  },
  {
    id: "uber-reviews",
    year: 2019,
    title: "Categorization and Classification of Uber Reviews",
    venue: "Advances in Computing and Intelligent Systems, Springer AIS (Web of Science)",
    dateLabel: "Apr 2019",
    contribution:
      "Aspect + sentiment categorization for Uber reviews; benchmarked Naive Bayes, KNN, decision trees, and random forests with reported accuracy.",
    href: "https://scholar.google.com/scholar?q=Categorization+Classification+Uber+Reviews+Divyasha+Pahuja",
  },
];

const CHAT_SNIPPET_MAX = 450;

function clipForChat(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trimEnd()}…`;
}

/** First month of the earliest role in `experiences` (Software Intern, Jun 2018). Update if career data changes. */
export const CAREER_START = new Date(2018, 5, 1);

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

/** Highest degree first, then others — keeps chat aligned with `educations` without hardcoding. */
export function formatHighestDegreeForChat(): string {
  const sorted = [...educations].sort((a, b) => b.year - a.year);
  if (sorted.length === 0) return "No degrees are listed in the portfolio data.";
  const [top, ...rest] = sorted;
  const gpa =
    top.gpa != null && !Number.isNaN(top.gpa) ? `; GPA ${top.gpa.toFixed(2)} / 4.0 where applicable` : "";
  const head = `Highest listed degree: ${top.degree} from ${top.school} (${top.period})${gpa}.`;
  if (rest.length === 0) return head;
  const tail = rest
    .map((ed) => {
      const g =
        ed.gpa != null && !Number.isNaN(ed.gpa) ? ` (GPA ${ed.gpa.toFixed(2)} / 4.0)` : "";
      return `${ed.degree} from ${ed.school} (${ed.period})${g}`;
    })
    .join("; ");
  return `${head} Also listed: ${tail}.`;
}

export function formatPublicationsForChat(maxLen = CHAT_SNIPPET_MAX): string {
  if (publications.length === 0) return "No publications are listed.";
  return publications
    .map((pub) => {
      const link = pub.href ? ` Link: ${pub.href}` : "";
      const line = `${pub.title} (${pub.dateLabel}) — ${pub.venue}. ${pub.contribution}${link}`;
      return clipForChat(line, maxLen);
    })
    .join("\n");
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
  {
    label: "Email",
    href: "mailto:?subject=Portfolio%20inquiry%20%28Divyasha%20Pahuja%29",
    angle: -90,
  },
  {
    label: "GitHub",
    href: "https://github.com/search?q=Divyasha+Pahuja&type=users",
    angle: -30,
  },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/divyasha-pahuja", angle: 30 },
  { label: "Phone", href: "tel:+14374356411", angle: 90 },
  {
    label: "Resume",
    href: "/Divyasha_Pahuja_Resume_Comprehensive.pdf",
    angle: 150,
  },
  {
    label: "Scholar",
    href: "https://scholar.google.com/scholar?q=Divyasha+Pahuja",
    angle: 210,
  },
];

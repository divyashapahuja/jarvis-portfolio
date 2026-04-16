export interface Project {
  id: string;
  name: string;
  tools: string[];
  description: string;
  link: string;
  color: string;
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
  },
  {
    id: "beta",
    name: "Project Beta",
    tools: ["Next.js", "Tailwind", "Prisma"],
    description:
      "Full-stack e-commerce platform with server-side rendering and integrated payment processing.",
    link: "#",
    color: "#ff6b6b",
  },
  {
    id: "gamma",
    name: "Project Gamma",
    tools: ["Python", "TensorFlow", "FastAPI"],
    description:
      "Machine learning pipeline for natural language processing with a REST API interface.",
    link: "#",
    color: "#4ecdc4",
  },
  {
    id: "delta",
    name: "Project Delta",
    tools: ["React Native", "Firebase", "Stripe"],
    description:
      "Cross-platform mobile app for peer-to-peer marketplace with real-time messaging.",
    link: "#",
    color: "#ffe66d",
  },
  {
    id: "epsilon",
    name: "Project Epsilon",
    tools: ["Three.js", "WebGL", "Node.js"],
    description:
      "Interactive 3D product configurator with real-time rendering and AR preview support.",
    link: "#",
    color: "#a29bfe",
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

export const contactLinks = [
  { label: "Email", href: "mailto:hello@example.com", angle: -90 },
  { label: "GitHub", href: "https://github.com", angle: -30 },
  { label: "LinkedIn", href: "https://linkedin.com", angle: 30 },
  { label: "Twitter", href: "https://twitter.com", angle: 90 },
  { label: "Resume", href: "#", angle: 150 },
  { label: "Blog", href: "#", angle: 210 },
];

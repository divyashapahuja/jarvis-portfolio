"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroScannerSection from "@/components/HeroScannerSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import EducationSection from "@/components/EducationSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    // Double rAF so pinned hero + projects carousel can read hash and lay out first.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const targetHash = hash.startsWith("#projects-") ? "#projects" : hash;
        const el = document.querySelector(targetHash);
        if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
      });
    });
  }, []);

  return (
    <main className="w-full min-w-0 overflow-x-clip">
      <Navbar />
      <HeroScannerSection />
      <ProjectsSection />
      <ExperienceSection />
      <EducationSection />
      <ContactSection />
    </main>
  );
}

import Navbar from "@/components/Navbar";
import HeroScannerSection from "@/components/HeroScannerSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import { CustomCursor, ChatBot } from "@/components/ClientOnly";

export default function Home() {
  return (
    <main>
      <CustomCursor />
      <Navbar />
      <HeroScannerSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
      <ChatBot />
    </main>
  );
}

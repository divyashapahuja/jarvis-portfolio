import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ChatBot from "@/components/ChatBot";
import { CustomCursor } from "@/components/ClientOnly";
import { portfolioProfile } from "@/lib/projects";

const metaDescription =
  portfolioProfile.about.length > 155
    ? `${portfolioProfile.about.slice(0, 152).trimEnd()}…`
    : portfolioProfile.about;

export const metadata: Metadata = {
  title: `${portfolioProfile.name} — Portfolio`,
  description: metaDescription,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SmoothScroll>{children}</SmoothScroll>
        <CustomCursor />
        {/* Outside main scroll tree so pinned sections / Lenis never steal clicks */}
        <ChatBot />
      </body>
    </html>
  );
}

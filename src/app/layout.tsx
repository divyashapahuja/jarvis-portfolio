import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ChatBot from "@/components/ChatBot";
import { CustomCursor } from "@/components/ClientOnly";

export const metadata: Metadata = {
  title: "Jane Doe — Portfolio",
  description: "Scroll-driven animated portfolio",
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

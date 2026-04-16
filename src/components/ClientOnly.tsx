"use client";

import dynamic from "next/dynamic";

export const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
export const ChatBot = dynamic(() => import("@/components/ChatBot"), { ssr: false });

"use client";

import dynamic from "next/dynamic";

export const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });

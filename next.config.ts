import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Parent folder has its own package-lock.json; without this, Turbopack picks the wrong root.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;

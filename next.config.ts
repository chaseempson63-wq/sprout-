import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This checkout can live inside another repo's tree (git worktrees under
  // .claude/worktrees), which makes Turbopack guess the wrong workspace
  // root from the outer lockfile. Pin it to this project.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

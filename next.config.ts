import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita que o Next.js procure um package-lock.json em pastas acima do projeto.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;

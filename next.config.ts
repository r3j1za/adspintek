import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ['192.168.1.64'],
  turbopack: {
    rules: {
      "*.css": {
        // Only run the Tailwind loader on plain CSS files that import Tailwind,
        // so compiled SCSS modules are left to Next.js' built-in handling.
        condition: {
          all: [
            { not: "foreign" },
            { path: /\.css$/ },
            { content: /@import\s+["']tailwindcss["']/ },
          ],
        },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  reactStrictMode: true,
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Enable static exports
  output: 'export',

  // 2. Replace 'your-repo-name' with your actual GitHub repository name
  // This ensures your CSS/JS loads from /repo-name/ instead of /
  basePath: '/your-repo-name',

  // 3. Required for static sites if you use the Next.js <Image /> component
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
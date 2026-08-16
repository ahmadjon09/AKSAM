import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Type safety is enforced by `npm run typecheck`; eslint is also runnable
  // manually. Skipping lint during build keeps the Cloudflare build fast.
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Product photos come from ImgBB; local demo shots live in /public.
    remotePatterns: [
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "ibb.co" }
    ]
  },
  poweredByHeader: false,
  reactStrictMode: true
};

export default nextConfig;

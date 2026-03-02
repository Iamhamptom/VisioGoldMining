/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pg'],
  },
  images: {
    unoptimized: true,
  },
  // Proxy Express-specific API routes that Next.js doesn't handle.
  // Next.js file-based API routes (auth, repos, branches, commits, artifacts,
  // workspaces) are matched first. Any unmatched /api/* path falls through to
  // Express via these fallback rewrites.
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: process.env.VERCEL
            ? '/api/server/:path*'
            : 'http://localhost:3001/api/:path*',
        },
      ],
    };
  },
};

export default nextConfig;

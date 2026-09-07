/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./prisma/**/*', './prisma/dev.db']
    }
  }
};

export default nextConfig;

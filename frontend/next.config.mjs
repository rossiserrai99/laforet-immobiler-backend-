/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for optimized Vercel/Docker deployments
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.onrender.com',
      },
    ],
  },
  // Disable x-powered-by header for security
  poweredByHeader: false,
};

export default nextConfig;

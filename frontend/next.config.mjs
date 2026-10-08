/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for optimized Vercel/Docker deployments
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
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
  env: {
    HERO_VIDEO_DESKTOP_URL: process.env.HERO_VIDEO_DESKTOP_URL || '',
    HERO_VIDEO_MOBILE_URL: process.env.HERO_VIDEO_MOBILE_URL || '',
    HERO_VIDEO_POSTER_URL: process.env.HERO_VIDEO_POSTER_URL || '',
    BANNER_1_URL: process.env.BANNER_1_URL || '',
    BANNER_2_URL: process.env.BANNER_2_URL || '',
    BANNER_3_URL: process.env.BANNER_3_URL || '',
  },
  // Disable x-powered-by header for security
  poweredByHeader: false,
};

export default nextConfig;

import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http', // Allowing HTTP for this specific domain
        hostname: 'pescoe.ac.in',
        port: '',
        pathname: '/assets/images/**', // Allow any image from this path
      },
      { // Added for avatar.vercel.sh used in UserMenu
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;

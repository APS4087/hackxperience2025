/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'dynamicweb.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/spline-proxy/:path*',
        destination: 'https://unpkg.com/:path*',
      },
    ];
  },
}

module.exports = nextConfig 
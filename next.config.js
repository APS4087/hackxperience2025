/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
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
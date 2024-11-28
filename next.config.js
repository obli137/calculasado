/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.cafecito.app',
        port: '',
        pathname: '/imgs/**',
      },
    ],
  },
}

module.exports = nextConfig
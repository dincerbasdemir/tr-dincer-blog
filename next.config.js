/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['tr.dincer.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tr.dincer.co',
      },
    ],
  },
}

module.exports = nextConfig

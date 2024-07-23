/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      },
    ],
  },
}

module.exports = nextConfig

// const stylexPlugin = require('@stylexjs/nextjs-plugin')

// module.exports = stylexPlugin({
//   rootDir: __dirname,
// })({ transpilePackages: ['@stylexjs'] })

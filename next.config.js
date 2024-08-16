/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      },
    ],
  },
  sassOptions: {
    includePaths: ['./src/styles'],
    prependData: `@use '_mixins' as mixins;`,
  },
}

module.exports = nextConfig

// const stylexPlugin = require('@stylexjs/nextjs-plugin')

// module.exports = stylexPlugin({
//   rootDir: __dirname,
// })({ transpilePackages: ['@stylexjs'] })

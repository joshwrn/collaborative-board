/** @type {import('next').NextConfig} */
// const nextConfig = {
//   transpilePackages: ['@stylexjs'],
// }

// module.exports = nextConfig

const stylexPlugin = require('@stylexjs/nextjs-plugin')

module.exports = stylexPlugin({
  rootDir: __dirname,
})({ transpilePackages: ['@stylexjs'] })

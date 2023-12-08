/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['picsum.photos', 'raw.githubusercontent.com', 'cdn.shopify.com'],
  },
  env: {
    API_URL: 'https://commerce-web-ten.vercel.app',
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'picsum.photos',
      'raw.githubusercontent.com',
      'cdn.shopify.com',
      'lh3.googleusercontent.com',
      'i.ibb.co',
    ],
  },
  env: {
    API_URL: 'https://commerce-web-ten.vercel.app',
  },
}

module.exports = nextConfig

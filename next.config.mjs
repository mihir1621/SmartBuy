/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'source.unsplash.com',
      'loremflickr.com',
      'fakestoreapi.com',
      'images.pexels.com',
      'via.placeholder.com'
    ],
  },
};

export default nextConfig;

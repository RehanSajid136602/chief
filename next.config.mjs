/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "cdn-food.tribune.com.pk",
      },
      {
        protocol: "https",
        hostname: "www.nettv4u.com",
      },
      {
        protocol: "https",
        hostname: "nettv4u.com",
      },
    ],
  },
};

export default nextConfig;

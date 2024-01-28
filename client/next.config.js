/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["ramda"],
  images: {
    domains: ["ui-avatars.com"],
  },
};

module.exports = nextConfig;

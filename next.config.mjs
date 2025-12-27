/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
    serverActions: { bodySizeLimit: '10mb' },
  },
  images: { remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }] },
};
export default nextConfig;

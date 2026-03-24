import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com', // Cần thêm domain này
        port: '',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Đôi khi Unsplash trả về link từ domain này
        port: '',
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;
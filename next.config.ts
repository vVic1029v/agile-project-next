import type { NextConfig } from "next";
import { hostname } from "os";
import path from "path";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: "res.cloudinary.com",
        
          },
        ],
      }
};

export default nextConfig;

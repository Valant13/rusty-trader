import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    WS_NO_BUFFER_UTIL: 'true',
  },
  outputFileTracingIncludes: {
    '**/*': [
      './rustplus.proto'
    ]
  },
  images: {
    domains: ['8pvfzj2pgdh2lugb.public.blob.vercel-storage.com'],
  },
};

export default nextConfig;

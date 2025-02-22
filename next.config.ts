import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    WS_NO_BUFFER_UTIL: 'true',
  },
  outputFileTracingIncludes: {
    '**/*': [
      './app/rustplus.proto'
    ]
  }
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  serverExternalPackages: ['pino', 'pino-loki'],
  /* config options here */
  webpack: (config, context) => {
    config.externals.push({
      "thread-stream": "commonjs thread-stream"
    })
    return config
  }
};

export default nextConfig;

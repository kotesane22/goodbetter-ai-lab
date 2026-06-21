import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/goodbetter-ai-lab" : "",
  assetPrefix: isProd ? "/goodbetter-ai-lab/" : "",
};

export default nextConfig;

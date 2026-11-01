import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps:false,
  allowedDevOrigins: ['192.168.148.1'],
  output: "standalone",
};

export default nextConfig;

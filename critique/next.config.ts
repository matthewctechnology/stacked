import type { NextConfig } from "next";


const isDeployment = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  ...(isDeployment && {
    basePath: '/stacked',
    assetPrefix: '/stacked/',
  }),
  output: 'export',
};

export default nextConfig;

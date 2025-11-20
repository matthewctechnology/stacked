import type { NextConfig } from 'next';


const isDeployment = process.env.GITHUB_PAGES === 'true';
const isE2E = process.env.E2E === 'true';

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  ...(isDeployment && {
    basePath: '/stacked',
    assetPrefix: '/stacked/',
  }),
  ...(isDeployment && !isE2E && { output: 'export' }),
};

export default nextConfig;

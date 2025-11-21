import { describe, expect, it, beforeEach, afterAll, jest } from '@jest/globals';
import type { NextConfig } from 'next';


describe('nextConfig conditional output', () => {
  const resetEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...resetEnv };
  });

  afterAll(() => {
    process.env = resetEnv;
  });

  it('sets basePath and assetPrefix when GITHUB_PAGES is true', async () => {
    process.env.GITHUB_PAGES = 'true';
    process.env.E2E = 'false';
    const { default: config }: { default: NextConfig } = await import('../../next.config');
    expect(config.basePath).toBe('/stacked');
    expect(config.assetPrefix).toBe('/stacked/');
  });

  it('does not set basePath, assetPrefix, or output when GITHUB_PAGES is not true', async () => {
    process.env.GITHUB_PAGES = 'false';
    process.env.E2E = 'false';
    const { default: config }: { default: NextConfig } = await import('../../next.config');
    expect(config.basePath).toBeUndefined();
    expect(config.assetPrefix).toBeUndefined();
  });
});

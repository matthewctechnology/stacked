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

  it('sets output: export when GITHUB_PAGES is true and E2E is false', async () => {
    process.env.GITHUB_PAGES = 'true';
    process.env.E2E = 'false';
    const { default: config }: { default: NextConfig } = await import('../../next.config');
    expect(config.output).toBe('export');
  });

  it('does not set output: export when GITHUB_PAGES is true and E2E is true', async () => {
    process.env.GITHUB_PAGES = 'true';
    process.env.E2E = 'true';
    const { default: config }: { default: NextConfig } = await import('../../next.config');
    expect(config.output).toBeUndefined();
  });

  it('does not set basePath, assetPrefix, or output when GITHUB_PAGES is not true', async () => {
    process.env.GITHUB_PAGES = 'false';
    process.env.E2E = 'false';
    const { default: config }: { default: NextConfig } = await import('../../next.config');
    expect(config.basePath).toBeUndefined();
    expect(config.assetPrefix).toBeUndefined();
    expect(config.output).toBeUndefined();
  });
});

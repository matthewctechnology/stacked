import { defineConfig, devices } from '@playwright/test';
import { getWebServerCommand } from './utils/getWebServerCommand';


export default defineConfig({
  testDir: './test/e2e',
  timeout: 30 * 1000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    trace: 'on-first-retry',
  },
  webServer: {
    command: getWebServerCommand(process.env.E2E === 'true'),
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

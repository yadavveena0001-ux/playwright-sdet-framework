import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.ENV || 'staging'}` });

/**
 * Central config. ENV var picks which .env file loads (e.g. ENV=staging, ENV=prod),
 * so the same suite can target different environments without code changes.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // This suite targets a shared public demo site, which is slower and less
  // predictable than a dedicated test environment — so we retry locally too,
  // not just in CI, and cap workers to avoid hammering it into slowness.
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 4 : 2,

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'reports/html-report' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
  ],
});

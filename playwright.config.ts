import { defineConfig, devices } from '@playwright/test';
require ('dotenv').config();

export default defineConfig({
  //Look for test files in the "tests" directory, relative to this configuration file.
  testDir: './tests',
  //Run tests in files in parallel
  fullyParallel: true,
  //Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  //Retry on CI only
  retries: process.env.CI ? 2 : 0,
  //Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,
  //Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: 'html',

  use: {
    baseURL: 'https://demoqa.com',
    //Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
    trace: 'on',
    launchOptions: {
      logger: {
        isEnabled: (name, severity) => true,
        log: (name, severity, message) => console.log(`${name} ${message}`)
      }
    }
  },

  /*Configure projects for major browsers */
  projects: [
    //Setup project
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        //Use prepared auth state.
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        //Use prepared auth state.
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        //Use prepared auth state.
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});

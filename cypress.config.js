import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:5175',
    supportFile: false,
    video: false,
    screenshotOnRunFailure: false,
  },
});

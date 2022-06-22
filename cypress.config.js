import { defineConfig } from 'cypress'

export default defineConfig({
  fixturesFolder: 'tests/e2e/fixtures',
  screenshotsFolder: 'tests/e2e/screenshots',
  videosFolder: 'tests/e2e/videos',
  e2e: {
    // eslint-disable-next-line no-unused-vars
    setupNodeEvents(on, config) {},
    specPattern: 'tests/e2e/specs/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'tests/e2e/support/index.js',
    baseUrl: 'http://localhost:3000/',
  },
})

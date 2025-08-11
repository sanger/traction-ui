import { defineConfig } from 'cypress'
import { rmdir } from 'fs'

export default defineConfig({
  fixturesFolder: 'tests/e2e/fixtures',
  screenshotsFolder: 'tests/e2e/screenshots',
  videosFolder: 'tests/e2e/videos',
  downloadsFolder: 'tests/e2e/downloads',
  e2e: {
    // Enables us to add custom plugins to use in the tests
    // See https://docs.cypress.io/api/node-events/overview for more information
    // eslint-disable-next-line no-unused-vars
    setupNodeEvents(on, config) {
      // Implement node event listeners here
      on('task', {
        // Deletes a folder and its contents
        // This is useful for cleaning up after tests that create files
        deleteFolder(folderName) {
          return new Promise((resolve, reject) => {
            rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
              if (err) {
                console.error(err)
                return reject(err)
              }
              resolve(null)
            })
          })
        },
      })
    },
    specPattern: 'tests/e2e/specs/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'tests/e2e/support/index.js',
    baseUrl: 'http://localhost:5173/',
    experimentalRunAllSpecs: true,
  },
})

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('withFlags', (features) => {
  cy.intercept(
    {
      url: '/flipper/api/actors/User',
    },
    {
      statusCode: 200,
      body: {
        flipper_id: 'User',
        features,
      },
    },
  )
})

Cypress.Commands.add('clickMenuItem', (text) => {
  cy.get('menu > li').contains(text).click()
})

Cypress.Commands.add('getFieldLabeled', (text) => {
  const field = cy.get('label').contains(text).its('for')
  cy.get(`#${field}`)
})

Cypress.Commands.add('fillIn', ({ field, with: content }) => {
  cy.getFieldLabeled(field).type(content)
})
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Add an ability to easily manipulate file fields
// https://github.com/abramenal/cypress-file-upload
import 'cypress-file-upload'

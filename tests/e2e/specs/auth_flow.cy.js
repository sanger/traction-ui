// Note cypress auth is mocked globally in support/mockAuth.js, so these tests will run with a mocked logged in user by default.
describe('Auth', () => {
  describe('Logged in user', () => {
    beforeEach(() => {
      cy.visit('/')
      // Wait for the user info request to ensure the app has loaded the user info before running tests
      // Declared in support/mockAuth.js
      cy.wait('@oktaUserInfo')
    })

    it('credentials appear', () => {
      cy.visit('/')
      cy.get('[data-attribute="account-icon"]').should('be.visible')
      cy.get('[data-attribute="account-identifier"]').should('contain', 'Test User')
    })

    it('can access protected pages', () => {
      cy.visit('#/labwhere-reception')
      cy.location('hash').should('eq', '#/labwhere-reception')
    })

    it('can log out', () => {
      const oktaDomain = Cypress.env('VITE_OKTA_DOMAIN')
      cy.intercept('POST', `https://${oktaDomain}/oauth2/v1/revoke`, {
        statusCode: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: {},
      }) /
        cy
          .intercept('GET', `https://${oktaDomain}/oauth2/v1/logout*`, {
            statusCode: 302,
            headers: {
              location: 'http://localhost:5173/#/',
            },
          })
          .as('oktaLogout')
      cy.get('[data-attribute="account-identifier"]').click()
      cy.get('[data-action="login"]').should('not.exist')
      cy.get('[data-action="logout"]').click()
      cy.wait('@oktaLogout')
      cy.location('hash').should('eq', '#/dashboard')
    })
  })

  describe('Logged out user', () => {
    beforeEach(() => {
      cy.clearLocalStorage()
      cy.visit('/')
    })

    it('credentials do not appear', () => {
      cy.get('[data-attribute="account-icon"]').should('not.exist')
      cy.get('[data-attribute="account-identifier"]').should('not.exist')
    })

    it('can log in', () => {
      // Note we aren't going through the login process as this is handled by Okta hosted login page
      cy.get('[data-attribute="account-identifier"]').click()
      cy.get('[data-action="logout"]').should('not.exist')
      cy.get('[data-action="login"]').should('be.visible')
    })

    it('cannot access protected pages', () => {
      cy.visit('#/labwhere-reception')
      cy.location('hash').should('eq', '#/dashboard')
    })
  })
})

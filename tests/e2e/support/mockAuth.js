// This file is processed and loaded automatically before all test files.

// This allows us to simulate a logged in user in Okta by setting the appropriate tokens in localStorage and intercepting requests to the Okta userinfo endpoint.
beforeEach(() => {
  cy.withFlags({
    'Y26-111-user-auth': { enabled: true },
  })

  const oktaDomain = Cypress.env('VITE_OKTA_DOMAIN')
  const clientId = Cypress.env('VITE_OKTA_CLIENT_ID')
  // To avoid token expiration, we create a new timestamp every time
  const oneDayFromNow = Date.now() + 1000 * 60 * 60 * 24

  localStorage.setItem(
    'okta-token-storage',
    JSON.stringify({
      idToken: {
        idToken: 'mock-id-token',
        claims: {
          sub: '',
          name: 'Test User',
          email: 'example@example.com',
          ver: 1,
          iss: `https://${oktaDomain}`,
          aud: clientId,
          iat: 1777276853,
          exp: 1777280453,
          jti: '',
          amr: ['pwd'],
          idp: 'DSSO',
          nonce: '',
          preferred_username: 'example@example.com',
          auth_time: 1777274029,
          at_hash: '',
        },
        expiresAt: oneDayFromNow,
        scopes: ['openid', 'email', 'profile'],
        authorizeUrl: `https://${oktaDomain}/oauth2/v1/authorize`,
        issuer: `https://${oktaDomain}`,
        clientId: clientId,
      },
      accessToken: {
        accessToken: 'mock-access-token',
        expiresAt: oneDayFromNow,
        tokenType: 'Bearer',
        scopes: ['openid', 'email', 'profile'],
        authorizeUrl: `https://${oktaDomain}/oauth2/v1/authorize`,
        userinfoUrl: `https://${oktaDomain}/oauth2/v1/userinfo`,
      },
    }),
  )
  // Intercept requests for Okta user profile and return our own response.
  cy.intercept(`https://${oktaDomain}/oauth2/v1/userinfo`, {
    statusCode: 200,
    body: {
      sub: '',
      name: 'Test User',
      locale: 'en_US',
      email: 'example@example.com',
      preferred_username: 'example@example.com',
      given_name: 'Test',
      family_name: 'User',
      zoneinfo: 'America/Los_Angeles',
      updated_at: 1774611037,
      email_verified: true,
    },
  }).as('oktaUserInfo')

  cy.intercept(`https://${oktaDomain}/.well-known/openid-configuration`, {
    statusCode: 200,
    body: {},
  })
})

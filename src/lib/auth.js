import { OktaAuth } from '@okta/okta-auth-js'

const oktaDomain = 'sanger.okta.com'
const clientId = '0oaurrnc5aBDHc8AI417'

const redirectUri = window.location.origin + '/login-callback'

const authClient = new OktaAuth({
  issuer: `https://${oktaDomain}`,
  clientId: clientId,
  redirectUri: redirectUri,
  scopes: ['openid', 'profile', 'email'],
})

// Subscribe to authState change event.
authClient.authStateManager.subscribe(function (authState) {
  // Logic based on authState is done here.
  if (!authState.isAuthenticated) {
    // render unauthenticated view
    return
  }

  // Render authenticated view
})

// Handle callback
if (authClient.token.isLoginRedirect()) {
  const { tokens } = await authClient.token.parseFromUrl() // remember to "await" this async call
  authClient.tokenManager.setTokens(tokens)
}

// normal app startup
authClient.start() // will update auth state and call event listeners

export default authClient

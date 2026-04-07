import { OktaAuth } from '@okta/okta-auth-js'

const oktaDomain = 'sanger.okta.com'
const clientId = '0oaurrnc5aBDHc8AI417'

const redirectUri = '/login-callback'

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
    console.log('User is not authenticated')
    return
  }

  // Render authenticated view
  console.log('User is authenticated')

  // Required view to render is saved in Session Storage for this host with the key 'referrerPath'
  // TODO: use the OktaAuth way of redirecting to the referrer path instead of manually handling it here
  const redirect = '/#'
  const referrerPath = sessionStorage.getItem('referrerPath') || '/'

  const location = redirect + referrerPath
  console.log('Redirecting to: ' + location)
  window.location = location
})

// Handle callback
if (authClient.token.isLoginRedirect()) {
  const { tokens } = await authClient.token.parseFromUrl() // remember to "await" this async call
  authClient.tokenManager.setTokens(tokens)
  console.log('Tokens set in token manager')
}

// normal app startup
authClient.start() // will update auth state and call event listeners

export default authClient

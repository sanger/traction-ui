import { OktaAuth } from '@okta/okta-auth-js'

const oktaDomain = import.meta.env.VITE_OKTA_DOMAIN
const clientId = import.meta.env.VITE_OKTA_CLIENT_ID

const redirectUri = '/login-callback.html'

const authClient = new OktaAuth({
  issuer: `https://${oktaDomain}`,
  clientId: clientId,
  redirectUri: redirectUri,
  // scopes: ['openid', 'profile', 'email'], // Not currently required in the Traction-UAT app
})

// Subscribe to authState change event.
authClient.authStateManager.subscribe(function (authState) {
  // Logic based on authState is done here.
  if (!authState.isAuthenticated) {
    // render unauthenticated view
    return
  }

  // Render authenticated view
  // Required view to render is saved in Session Storage for this host with the key 'referrerPath'
  // TODO: use the OktaAuth way of redirecting to the referrer path instead of manually handling it here
  const redirect = '/#'
  const referrerPath = sessionStorage.getItem('referrerPath') || '/'

  const location = redirect + referrerPath
  window.location = location
})

// Handle callback
if (authClient.token.isLoginRedirect()) {
  const { tokens } = await authClient.token.parseFromUrl() // remember to "await" this async call
  authClient.tokenManager.setTokens(tokens)
}

// normal app startup
authClient.start() // will update auth state and call event listeners

export default authClient

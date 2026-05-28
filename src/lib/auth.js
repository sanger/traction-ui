import { OktaAuth } from '@okta/okta-auth-js'
const SESSION_WARNING_KEY = 'tokenExpirationWarningShown'
const oktaDomain = import.meta.env.VITE_OKTA_DOMAIN
const clientId = import.meta.env.VITE_OKTA_CLIENT_ID

const redirectUri = '/login-callback.html'

function redirectToReferrer() {
  const redirect = '/#'
  const referrerPath = sessionStorage.getItem('referrerPath') || '/'
  sessionStorage.removeItem('referrerPath')

  window.location = redirect + referrerPath
}

const authClient = new OktaAuth({
  issuer: `https://${oktaDomain}`,
  clientId: clientId,
  redirectUri: redirectUri,
  tokenManager: {
    autoRenew: true,
    // Start trying to renew tokens 10 minutes before they expire
    // If this fails we show the user a warning that their session is about to expire and they need to re login
    expireEarlySeconds: 600,
  },
  // scopes: ['openid', 'profile', 'email'], // Not currently required in the Traction-UAT app
})

authClient.tokenManager.on('expired', async function (key) {
  if (key !== 'accessToken') return
  // Store alert to display after redirect completes
  sessionStorage.setItem('sessionExpiredAlert', 'true')
  await authClient.signOut()
})

authClient.tokenManager.on('renewed', function (key) {
  if (key !== 'accessToken') return
  sessionStorage.removeItem(SESSION_WARNING_KEY)
})

// Handle callback
if (authClient.isLoginRedirect()) {
  const { tokens } = await authClient.token.parseFromUrl()
  sessionStorage.removeItem(SESSION_WARNING_KEY)
  authClient.tokenManager.setTokens(tokens)
  redirectToReferrer()
}

// normal app startup
authClient.start() // will update auth state and call event listeners

export default authClient

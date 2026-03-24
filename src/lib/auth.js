import { OktaAuth } from '@okta/okta-auth-js'

const oktaDomain = 'sanger.okta.com'
const clientId = '0oaurrnc5aBDHc8AI417'

const redirectUri = window.location.origin + '/login-callback'

const oktaAuth = new OktaAuth({
  issuer: `https://${oktaDomain}`,
  clientId: clientId,
  redirectUri: redirectUri,
  scopes: ['openid', 'profile', 'email'],
})

export default oktaAuth

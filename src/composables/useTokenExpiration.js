// This is a back up if the token auto renew logic doesn't work as expected.
// This composable will show a warning alert when the token is close to expiring and on user activity.
import useAlert from '@/composables/useAlert.js'

const ACTIVITY_EVENTS = ['click', 'keydown', 'mousemove', 'touchstart']
const DEBOUNCE_MS = 1000
const MIN_CHECK_INTERVAL_MS = 30_000
const SESSION_WARNING_KEY = 'tokenExpirationWarningShown'

// Needs to be less than 10 mins (Okta token renewal threshold) to ensure the warning shows before the token expires
const WARNING_THRESHOLD_MINUTES = 5
import authClient from '@/lib/auth.js'

/**
 * Composable that monitors user activity and checks whether the Okta access token
 * is close to expiring. On user activity, it debounces a check (at most once every
 * MIN_CHECK_INTERVAL_MS). If the token is expiring soon it attempts a silent renewal;
 * if renewal fails it shows a warning alert once per browser session.
 */
export default function useTokenExpiration() {
  const { showAlert } = useAlert()

  let debounceTimer = null
  let lastCheckTime = 0

  /**
   * Returns seconds until the access token expires, or null if no token is found.
   * @returns {Promise<number|null>}
   */
  async function getSecondsUntilExpiry() {
    const token = await authClient.tokenManager.get('accessToken')
    if (!token?.expiresAt) return null
    return Math.round(token.expiresAt - Date.now() / 1000)
  }

  /**
   * Returns true if the access token exists and will expire within WARNING_THRESHOLD_MINUTES.
   * @returns {Promise<boolean>}
   */
  async function isTokenExpiringSoon() {
    const seconds = await getSecondsUntilExpiry()
    if (seconds === null) return false
    return seconds > 0 && seconds <= WARNING_THRESHOLD_MINUTES * 60
  }

  async function checkAndRefreshToken() {
    const now = Date.now()
    if (now - lastCheckTime < MIN_CHECK_INTERVAL_MS) return
    lastCheckTime = now

    const expiringSoon = await isTokenExpiringSoon()
    if (!expiringSoon) return

    if (!sessionStorage.getItem(SESSION_WARNING_KEY)) {
      const secondsUntilExpiry = await getSecondsUntilExpiry()
      const minutesUnitlExpiry = Math.floor(secondsUntilExpiry / 60)
      sessionStorage.setItem(SESSION_WARNING_KEY, 'true')
      showAlert(
        `Your session is expiring soon (${minutesUnitlExpiry}m). Please save your work and log in again via the account menu.`,
        'warning',
      )
    }
  }

  function handleActivity() {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(checkAndRefreshToken, DEBOUNCE_MS)
  }

  function mountListeners() {
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, handleActivity))
  }

  function unMountListeners() {
    ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, handleActivity))
    clearTimeout(debounceTimer)
  }

  return {
    mountListeners,
    unMountListeners,
    checkAndRefreshToken,
    isTokenExpiringSoon,
    getSecondsUntilExpiry,
    WARNING_THRESHOLD_MINUTES,
  }
}

import { mount } from '@vue/test-utils'
import { defineComponent, onMounted, onUnmounted } from 'vue'
import useTokenExpiration from '@/composables/useTokenExpiration.js'

vi.mock('vue-router')
vi.mock('@/lib/auth.js', () => ({
  default: {
    tokenManager: {
      get: vi.fn(),
    },
  },
}))

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert.js', () => ({
  default: () => ({ showAlert: mockShowAlert }),
}))

import authClient from '@/lib/auth.js'

// Wrap composable in a component so onMounted/onUnmounted lifecycle hooks work
function mountComposable() {
  const TestComponent = defineComponent({
    setup() {
      const { mountListeners, unMountListeners } = useTokenExpiration()

      onMounted(() => {
        mountListeners()
      })

      onUnmounted(() => {
        unMountListeners()
      })
    },
    template: '<div />',
  })
  return mount(TestComponent, { global: { plugins: [] } })
}

describe('useTokenExpiration', () => {
  describe('listeners', () => {
    it('registers activity event listeners on mount', () => {
      const addEventSpy = vi.spyOn(window, 'addEventListener')
      const wrapper = mountComposable()
      const registeredEvents = addEventSpy.mock.calls.map(([event]) => event)
      expect(registeredEvents).toContain('click')
      expect(registeredEvents).toContain('keydown')
      expect(registeredEvents).toContain('mousemove')
      expect(registeredEvents).toContain('touchstart')
      wrapper.unmount()
      addEventSpy.mockRestore()
    })

    it('removes activity event listeners on unmount', () => {
      const removeEventSpy = vi.spyOn(window, 'removeEventListener')
      const wrapper = mountComposable()
      wrapper.unmount()
      const removedEvents = removeEventSpy.mock.calls.map(([event]) => event)
      expect(removedEvents).toContain('click')
      expect(removedEvents).toContain('keydown')
      expect(removedEvents).toContain('mousemove')
      expect(removedEvents).toContain('touchstart')
      removeEventSpy.mockRestore()
    })
  })

  describe('#checkAndRefreshToken', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.clearAllMocks()
      sessionStorage.clear()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('debounces multiple calls within the minimum check interval', async () => {
      const composable = useTokenExpiration()
      // Expiry far in the future keeps path simple: one token lookup per allowed check.
      authClient.tokenManager.get.mockResolvedValue({ expiresAt: Date.now() / 1000 + 3600 })

      await composable.checkAndRefreshToken()
      await composable.checkAndRefreshToken()
      expect(authClient.tokenManager.get).toHaveBeenCalledTimes(1)
      vi.advanceTimersByTime(30_000)
      await composable.checkAndRefreshToken()
      expect(authClient.tokenManager.get).toHaveBeenCalledTimes(2)
    })

    it('shows alert when token is expiring soon and no alert shown this session', async () => {
      const composable = useTokenExpiration()
      authClient.tokenManager.get.mockResolvedValue({ expiresAt: Date.now() / 1000 + 1 * 60 }) // 1 min until expiry

      await composable.checkAndRefreshToken()
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Your session is expiring soon (1m). Please save your work and log in again via the account menu.',
        'warning',
      )
      expect(sessionStorage.getItem('tokenExpirationWarningShown')).toBe('true')
    })

    it('does not show alert again if already shown this session', async () => {
      const composable = useTokenExpiration()
      authClient.tokenManager.get.mockResolvedValue({ expiresAt: Date.now() / 1000 + 1 * 60 }) // 1 min until expiry
      sessionStorage.setItem('tokenExpirationWarningShown', 'true')

      await composable.checkAndRefreshToken()
      expect(mockShowAlert).not.toHaveBeenCalled()
    })
  })

  describe('#isTokenExpiringSoon', () => {
    it('returns false when no token exists', async () => {
      const composable = useTokenExpiration()
      authClient.tokenManager.get.mockResolvedValue(null)
      expect(await composable.isTokenExpiringSoon()).toBe(false)
    })

    it('returns true when token expires within warning threshold', async () => {
      const composable = useTokenExpiration()
      authClient.tokenManager.get.mockResolvedValue({
        expiresAt: Date.now() / 1000 + (composable.WARNING_THRESHOLD_MINUTES - 1) * 60,
      }) // 4 min until expiry
      expect(await composable.isTokenExpiringSoon()).toBe(true)
    })

    it('returns false when token expires outside warning threshold', async () => {
      const composable = useTokenExpiration()
      authClient.tokenManager.get.mockResolvedValue({
        expiresAt: Date.now() / 1000 + (composable.WARNING_THRESHOLD_MINUTES + 1) * 60,
      }) // 6 min until expiry
      expect(await composable.isTokenExpiringSoon()).toBe(false)
    })

    it('returns false when token has already expired', async () => {
      const composable = useTokenExpiration()
      authClient.tokenManager.get.mockResolvedValue({ expiresAt: Date.now() / 1000 - 60 }) // expired 1 min ago
      expect(await composable.isTokenExpiringSoon()).toBe(false)
    })
  })

  describe('#getSecondsUntilExpiry', () => {
    it('returns null when no token exists', async () => {
      const composable = useTokenExpiration()
      authClient.tokenManager.get.mockResolvedValue(null)
      expect(await composable.getSecondsUntilExpiry()).toBeNull()
    })

    it('returns null when token has no expiresAt', async () => {
      const composable = useTokenExpiration()
      authClient.tokenManager.get.mockResolvedValue({ accessToken: 'abc' })
      expect(await composable.getSecondsUntilExpiry()).toBeNull()
    })

    it('returns seconds until expiry', async () => {
      const composable = useTokenExpiration()
      const expiresAt = Date.now() / 1000 + 5 * 60 // 5 min until expiry
      authClient.tokenManager.get.mockResolvedValue({ expiresAt })
      const seconds = await composable.getSecondsUntilExpiry()
      expect(seconds).toBeGreaterThan(0)
      expect(seconds).toBeLessThanOrEqual(5 * 60)
    })
  })
})

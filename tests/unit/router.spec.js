const navigationGuard = vi.fn()
const LoginCallbackStub = { name: 'LoginCallbackStub', template: '<div>login callback</div>' }

vi.mock('@okta/okta-vue', () => ({
  LoginCallback: LoginCallbackStub,
  navigationGuard,
}))

describe('router', () => {
  let router
  let isAuthenticated

  beforeEach(async () => {
    isAuthenticated = true
    // The okta-vue nav guard has several steps so we mock a basic one here
    navigationGuard.mockImplementation((to) => {
      if (to.meta.requiresAuth && !isAuthenticated) {
        return { path: '/login-callback' }
      }
      return true
    })

    router = (await import('@/router.js')).default
  })

  describe('authentication', () => {
    it('prevents navigation to protected routes when unauthenticated', async () => {
      isAuthenticated = false

      await router.push('/labwhere-reception')

      expect(router.currentRoute.value.path).toBe('/login-callback')
    })

    it('allows navigation to protected routes when authenticated', async () => {
      isAuthenticated = true

      await router.push('/labwhere-reception')
      expect(router.currentRoute.value.name).toBe('LabWhereReception')
    })

    it('registers the Okta navigation guard', async () => {
      await router.push('/dashboard')
      expect(navigationGuard).toHaveBeenCalled()
    })

    it('allows navigation to a public route when unauthenticated', async () => {
      isAuthenticated = false

      await router.push('/dashboard')

      expect(router.currentRoute.value.name).toBe('Dashboard')
    })
  })

  it('redirects / to Dashboard', async () => {
    await router.push('/')
    expect(router.currentRoute.value.name).toBe('Dashboard')
  })

  it('redirects unknown paths to 404', async () => {
    await router.push('/not-a-real-route')
    expect(router.currentRoute.value.name).toBe('404')
  })

  it('adds default pagination query params for paginated routes', async () => {
    await router.push('/pacbio/samples')

    expect(router.currentRoute.value.query).toMatchObject({
      page_size: 25,
      page_number: 1,
      page_count: 1,
    })
  })
})

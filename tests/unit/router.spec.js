import { beforeEach, describe, expect, it, vi } from 'vitest'

const navigationGuard = vi.fn()
const LoginCallbackStub = { name: 'LoginCallbackStub', template: '<div>login callback</div>' }

vi.mock('@okta/okta-vue', () => ({
  LoginCallback: LoginCallbackStub,
  navigationGuard,
}))

const routeComponentLoaders = {
  Dashboard: () => import('@/views/TractionDashboard.vue'),
  UserDetails: () => import('@/views/UserDetails.vue'),
  Reception: () => import('@/views/GeneralReception.vue'),
  LabWhereReception: () => import('@/views/LabwhereReception.vue'),
  LabelPrinting: () => import('@/views/LabelPrinting.vue'),
  QcResultsUpload: () => import('@/views/QcResultsUpload.vue'),
  SampleReport: () => import('@/views/SampleReport.vue'),
  FlexiblePoolingIndex: () => import('@/views/FlexiblePoolingIndex.vue'),
  FlexiblePool: () => import('@/views/FlexiblePoolCreate.vue'),
  FlexibleIndividualPoolCreate: () => import('@/views/FlexibleIndividualPoolCreate.vue'),
  PacbioSampleIndex: () => import('@/views/pacbio/PacbioSampleIndex.vue'),
  PacbioPlateIndex: () => import('@/views/pacbio/PacbioPlateIndex.vue'),
  PacbioLibraryIndex: () => import('@/views/pacbio/PacbioLibraryIndex.vue'),
  PacbioPoolIndex: () => import('@/views/pacbio/PacbioPoolIndex.vue'),
  PacbioRunIndex: () => import('@/views/pacbio/PacbioRunIndex.vue'),
  PacbioRunShow: () => import('@/views/pacbio/PacbioRunShow.vue'),
  PacbioPoolCreate: () => import('@/views/pacbio/PacbioPoolCreate.vue'),
  PacbioLibraryBatchCreate: () => import('@/views/pacbio/PacbioLibraryBatchCreate.vue'),
  ONTSampleIndex: () => import('@/views/ont/ONTSampleIndex.vue'),
  ONTPoolCreate: () => import('@/views/ont/ONTPoolCreate.vue'),
  ONTPoolIndex: () => import('@/views/ont/ONTPoolIndex.vue'),
  ONTRunIndex: () => import('@/views/ont/ONTRunIndex.vue'),
  ONTRunShow: () => import('@/views/ont/ONTRunShow.vue'),
  404: () => import('@/views/PageNotFound.vue'),
}

const authExpectations = {
  Dashboard: false,
  UserDetails: true,
  Reception: false,
  LabWhereReception: false,
  LabelPrinting: false,
  QcResultsUpload: false,
  SampleReport: false,
  FlexiblePoolingIndex: false,
  FlexiblePool: false,
  FlexibleIndividualPoolCreate: false,
  PacbioSampleIndex: false,
  PacbioPlateIndex: false,
  PacbioLibraryIndex: false,
  PacbioPoolIndex: false,
  PacbioRunIndex: false,
  PacbioRunShow: false,
  PacbioPoolCreate: false,
  PacbioLibraryBatchCreate: false,
  ONTSampleIndex: false,
  ONTPoolCreate: false,
  ONTPoolIndex: false,
  ONTRunIndex: false,
  ONTRunShow: false,
  404: false,
}

const findRouteByName = (router, name) => router.getRoutes().find((route) => route.name === name)

describe('router', () => {
  let router
  let isAuthenticated

  beforeEach(async () => {
    vi.resetModules()
    navigationGuard.mockReset()

    isAuthenticated = true
    navigationGuard.mockImplementation((to) => {
      if (to.meta.requiresAuth && !isAuthenticated) {
        return { path: '/login-callback' }
      }
      return true
    })

    router = (await import('@/router')).default
  })

  it('maps each named route to the expected component', async () => {
    for (const [name, loadComponent] of Object.entries(routeComponentLoaders)) {
      const route = findRouteByName(router, name)
      const expectedComponent = (await loadComponent()).default

      expect(route, `missing route: ${name}`).toBeTruthy()
      expect(route.components.default).toBe(expectedComponent)
    }
  })

  it('maps /login-callback to the Okta login callback component', () => {
    const route = router.getRoutes().find((candidate) => candidate.path === '/login-callback')
    expect(route).toBeTruthy()
    expect(route.components.default).toBe(LoginCallbackStub)
  })

  it('marks the correct routes as authenticated or public', () => {
    for (const [name, requiresAuth] of Object.entries(authExpectations)) {
      const route = findRouteByName(router, name)
      expect(Boolean(route.meta.requiresAuth)).toBe(requiresAuth)
    }
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

  it('redirects an unauthenticated user away from a protected route', async () => {
    isAuthenticated = false

    await router.push('/user-details')

    expect(router.currentRoute.value.path).toBe('/login-callback')
  })

  it('allows an authenticated user onto a protected route', async () => {
    isAuthenticated = true

    await router.push('/user-details')

    expect(router.currentRoute.value.name).toBe('UserDetails')
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

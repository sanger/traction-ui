import PageNotFound from '@/views/PageNotFound'
import { mount, router, flushPromises } from '@support/testHelper'

/*
Add this to router
If wanting to check redirection to error page is working
{ path: '*', redirect: { name: '404'} },
{ path: '/404', name: '404'},

it('will redirect to page not found if invalid path', () => {
  wrapper.vm.$router.push('/invalidpath')
  expect(wrapper.vm.$route.path).toBe('/404')
})
*/
describe('PageNotFound.vue', () => {
  let wrapper

  beforeAll(async () => {
    // Preload lazy-loaded route components used in this spec to avoid
    // module imports being scheduled after test teardown.
    await Promise.all([
      import('@/views/PacbioView.vue'),
      import('@/views/pacbio/PacbioRunIndex.vue'),
      import('@/views/ONT.vue'),
      import('@/views/ont/ONTRunIndex.vue'),
    ])
  })

  beforeEach(async () => {
    wrapper = mount(PageNotFound, { router })
  })

  describe('Links on page ', () => {
    it('will redirect to dashboard', async () => {
      await wrapper.find('#dashboard-link').trigger('click')
      await flushPromises()
      expect(wrapper.vm.$route.path).toBe('/dashboard')
    })
    it('will redirect to pacbio runs', async () => {
      await wrapper.find('#pacbio-link').trigger('click')
      await flushPromises()
      expect(wrapper.vm.$route.path).toBe('/pacbio/runs')
    })
    it('will redirect to ont runs', async () => {
      await wrapper.find('#ont-link').trigger('click')
      await flushPromises()
      expect(wrapper.vm.$route.path).toBe('/ont/runs')
    })
  })
})

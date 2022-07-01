import PageNotFound from '@/views/PageNotFound'
import { mount, localVue, router } from '@support/testHelper'

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

  beforeEach(() => {
    wrapper = mount(PageNotFound, { router, localVue })
  })

  describe('Links on page ', () => {
    it('will redirect to dashboard', () => {
      wrapper.find('#backToDashboard').trigger('click')
      expect(wrapper.vm.$route.path).toBe('/dashboard')
    })
    it('will redirect to pacbio runs', () => {
      wrapper.find('#backToPacbioRuns').trigger('click')
      expect(wrapper.vm.$route.path).toBe('/pacbio/runs')
    })
    it('will redirect to saphyr runs', () => {
      wrapper.find('#backToSaphyrRuns').trigger('click')
      expect(wrapper.vm.$route.path).toBe('/saphyr/runs')
    })
  })
})

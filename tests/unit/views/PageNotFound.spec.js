import PageNotFound from '@/views/PageNotFound'
import { mount, localVue } from '../testHelper'
import VueRouter from 'vue-router'

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

  let wrapper, router

  beforeEach(() => {
    router = new VueRouter({ routes: [
      { path: '/dashboard', name: 'Dashboard' },
      { path: '/saphyr/runs', name: 'SaphyrRuns'},
      { path: '/pacbio/runs', name: 'PacbioRuns'},
      ]
    })
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
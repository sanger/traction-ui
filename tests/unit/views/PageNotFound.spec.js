import PageNotFound from '@/views/PageNotFound'
import { mount, localVue } from '../testHelper'
import VueRouter from 'vue-router'

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
import Saphyr from '@/views/Saphyr'
import { mount, localVue, store } from '../testHelper'
import VueRouter from 'vue-router'

// TODO: aargh!!! more unhandled exception errors. Need to find a way of generally 
// stubbing out API calls
describe('Saphyr.vue', () => {

  let wrapper, router

  beforeEach(() => {
    router = new VueRouter({ routes:
      [
        { path: '/saphyr/reception', name: 'SaphyrReception' },
        { path: '/saphyr/runs', name: 'SaphyrRuns' },
        { path: '/saphyr/samples', name: 'SaphyrSamples' },
        { path: '/saphyr/libraries', name: 'SaphyrLibraries' }
      ]
    })
    wrapper = mount(Saphyr, { router, localVue,
      store }
    )
  })

  describe('navigation', () => {

    let link

    beforeEach(() => {
    })

    it('will have a link to the reception page', () => {
      link = wrapper.find('a.reception')
      link.trigger('click')
      expect(wrapper.vm.$route.path).toBe('/saphyr/reception')
    })

    it('will have a link to the samples page', () => {
      link = wrapper.find('a.samples')
      link.trigger('click')
      expect(wrapper.vm.$route.path).toBe('/saphyr/samples')
    })

    it('will have a link to the libraries page', () => {
      link = wrapper.find('a.libraries')
      link.trigger('click')
      expect(wrapper.vm.$route.path).toBe('/saphyr/libraries')
    })

    it('will have a link to the runs page', () => {
      link = wrapper.find('.runs')
      link.trigger('click')
      expect(wrapper.vm.$route.path).toBe('/saphyr/runs')
    })

  })

})


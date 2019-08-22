import Pacbio from '@/views/Pacbio'
import { mount, localVue, store } from '../testHelper'
import router from '@/router'

describe('Pacbio.vue', () => {

  let wrapper

  beforeEach(() => {
    wrapper = mount(Pacbio, { router, localVue,
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
      expect(wrapper.vm.$route.path).toBe('/pacbio/reception')
      expect(wrapper.find('h5').text()).toEqual('Pacbio Reception')
    })

    it('will have a link to the samples page', () => {
      link = wrapper.find('a.samples')
      link.trigger('click')
      expect(wrapper.vm.$route.path).toBe('/pacbio/samples')
      expect(wrapper.find('h5').text()).toEqual('Pacbio Samples')
    })

    it('will have a link to the libraries page', () => {
      link = wrapper.find('a.libraries')
      link.trigger('click')
      expect(wrapper.vm.$route.path).toBe('/pacbio/libraries')
      expect(wrapper.find('h5').text()).toEqual('Pacbio Libraries')
    })

    it('will have a link to the runs page', () => {
      link = wrapper.find('.runs')
      link.trigger('click')
      expect(wrapper.vm.$route.path).toBe('/pacbio/runs')
      expect(wrapper.find('h5').text()).toEqual('Pacbio Runs')
    })

  })

})

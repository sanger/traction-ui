import Dashboard from '@/views/Dashboard'
import { mount, localVue, store } from '../testHelper'
import VueRouter from 'vue-router'

describe('Dashboard.vue', () => {

  let wrapper, router, box

  beforeEach(() => {
   router = new VueRouter({ routes: [
        { path: '/saphyr', name: 'Saphyr', component: require('@/views/Saphyr') },
        { path: '/pacbio', name: 'Pacbio', component: require('@/views/Pacbio') }
      ]
    })
    wrapper = mount(Dashboard, { router, localVue,
      store }
    )
  })

  it('will have a box for each pipeline', () => {
    expect(wrapper.findAll('.pipeline').length).toEqual(2)
  })

  describe('for saphyr', () => {

    beforeEach(() => {
      box = wrapper.find('.pipeline.saphyr')
    })

    it('will have the name', () => {
      expect(box.find('h4').text()).toEqual('Saphyr')      
    })

    it('will have the description', () => {
      expect(box.find('.description').text()).toBeDefined()
    })

    it('will redirect to the namespace', () => {
      box.find('a').trigger('click')
      expect(wrapper.vm.$route.path).toBe('/saphyr')
    })

  })

  describe('for pacbio', () => {

    beforeEach(() => {
      box = wrapper.find('.pipeline.pacbio')
    })

    it('will have the name', () => {
      expect(box.find('h4').text()).toEqual('Pacbio')      
    })

    it('will have the description', () => {
      expect(box.find('.description').text()).toBeDefined()
    })

    it('will redirect to the namespace', () => {
      box.find('a').trigger('click')
      expect(wrapper.vm.$route.path).toBe('/pacbio')
    })

  })

})


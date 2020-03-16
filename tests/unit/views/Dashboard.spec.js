import Dashboard from '@/views/Dashboard'
import { mount, localVue, store } from '../testHelper'
import VueRouter from 'vue-router'

describe('Dashboard.vue', () => {

  let wrapper, router, box, dashboard

  beforeEach(() => {
   router = new VueRouter({ routes: [
        { path: '/saphyr', name: 'Saphyr' },
        { path: '/pacbio', name: 'Pacbio' },
        { path: '/ont', name: 'ONT' },
      ]
    })
    wrapper = mount(Dashboard, { router, localVue, store } )
    dashboard = wrapper.vm
  })

  describe('pipelines', () => {
    it('will have pipelines config', () => {
      let config = dashboard.pipelines
      expect(config.length).toEqual(3)
    })

    it('will have saphyr config', () => {
      let config = dashboard.pipelines
      expect(config[0]['name']).toEqual('saphyr')
      expect(config[0]['title']).toContain('Saphyr')
    })

    it('will have pacbio config', () => {
      let config = dashboard.pipelines
      expect(config[1]['name']).toEqual('pacbio')
      expect(config[1]['title']).toEqual('Pacbio')
    })

    it('will have ont config', () => {
      let config = dashboard.pipelines
      expect(config[2]['name']).toEqual('ont')
      expect(config[2]['title']).toEqual('ONT')
    })
  })

  describe('for saphyr', () => {
    beforeEach(() => {
      box = wrapper.find('.card.saphyr')
    })

    it('will have a title', () => {
      expect(box.find('.card-title').text()).toEqual('Saphyr')
    })
    
    it('will have a description', () => {
      expect(box.find('.card-text').text()).toBeDefined()
    })

    it('will have a button', () => {
      expect(box.find('button').text()).toEqual('Saphyr')
    })

    it('will redirect to the namespace', () => {
      box.find('button').trigger('click')
      expect(wrapper.vm.$route.path).toBe('/saphyr')
    })
  })

  describe('for pacbio', () => {
    beforeEach(() => {
      box = wrapper.find('.card.pacbio')
    })

    it('will have a title', () => {
      expect(box.find('.card-title').text()).toEqual('Pacbio')
    })

    it('will have a description', () => {
      expect(box.find('.card-text').text()).toBeDefined()
    })

    it('will have a button', () => {
      expect(box.find('button').text()).toEqual('Pacbio')
    })

    it('will redirect to the namespace', () => {
      box.find('button').trigger('click')
      expect(wrapper.vm.$route.path).toBe('/pacbio')
    })
  })

  describe('for ont', () => {
    beforeEach(() => {
      box = wrapper.find('.card.ont')
    })

    it('will have a title', () => {
      expect(box.find('.card-title').text()).toEqual('ONT')
    })

    it('will have a description', () => {
      expect(box.find('.card-text').text()).toBeDefined()
    })

    it('will have a button', () => {
      expect(box.find('button').text()).toEqual('ONT')
    })

    it('will redirect to the namespace', () => {
      box.find('button').trigger('click')
      expect(wrapper.vm.$route.path).toBe('/ont')
    })
  })
})

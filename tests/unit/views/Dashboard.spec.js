import Dashboard from '@/views/Dashboard'
import { mount, localVue, store, router } from 'testHelper'

describe('Dashboard.vue', () => {
  let wrapper, box, dashboard

  beforeEach(() => {
    wrapper = mount(Dashboard, { router, localVue, store })
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

    describe('route buttons', () => {
      it('will have a reception button', () => {
        let receptionButton = box.findAll('button').at(0)
        expect(receptionButton.text()).toEqual('Reception')
        receptionButton.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/saphyr/reception')
      })
      it('will have a samples button', () => {
        let receptionButton = box.findAll('button').at(1)
        expect(receptionButton.text()).toEqual('Samples')
        receptionButton.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/saphyr/samples')
      })
      it('will have a libraries button', () => {
        let receptionButton = box.findAll('button').at(2)
        expect(receptionButton.text()).toEqual('Libraries')
        receptionButton.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/saphyr/libraries')
      })
      it('will have a runs button', () => {
        let receptionButton = box.findAll('button').at(3)
        expect(receptionButton.text()).toEqual('Runs')
        receptionButton.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/saphyr/runs')
      })
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

    describe('route buttons', () => {
      it('will have a reception button', () => {
        let receptionButton = box.findAll('button').at(0)
        expect(receptionButton.text()).toEqual('Reception')
        receptionButton.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/pacbio/reception')
      })
      it('will have a plate reception button', () => {
        let receptionButton = box.findAll('button').at(1)
        expect(receptionButton.text()).toEqual('Plate reception')
        receptionButton.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/pacbio/plate-reception')
      })
      it('will have a plates button', () => {
        let platesButton = box.findAll('button').at(2)
        expect(platesButton.text()).toEqual('Plates')
        platesButton.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/pacbio/plates')
      })
      it('will have a samples button', () => {
        let receptionButton = box.findAll('button').at(3)
        expect(receptionButton.text()).toEqual('Samples')
        receptionButton.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/pacbio/samples')
      })
      it('will have a libraries button', () => {
        let receptionButton = box.findAll('button').at(4)
        expect(receptionButton.text()).toEqual('Libraries')
        receptionButton.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/pacbio/libraries')
      })
      it('will have a pools button', () => {
        let receptionButton = box.findAll('button').at(5)
        expect(receptionButton.text()).toEqual('Pools')
        receptionButton.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/pacbio/pools')
      })
      it('will have a runs button', () => {
        let receptionButton = box.findAll('button').at(6)
        expect(receptionButton.text()).toEqual('Runs')
        receptionButton.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/pacbio/runs')
      })
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

    describe('route buttons', () => {})
  })
})

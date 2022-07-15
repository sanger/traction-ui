import TractionDashboard from '@/views/TractionDashboard'
import { mount, localVue, store, router } from '@support/testHelper'

describe('TractionDashboard.vue', () => {
  let wrapper, box, dashboard

  beforeEach(() => {
    wrapper = mount(TractionDashboard, { router, localVue, store })
    dashboard = wrapper.vm
  })

  describe('pipelines', () => {
    it('will have pipelines config', () => {
      const config = dashboard.pipelines
      expect(config.length).toEqual(3)
    })

    it('will have saphyr config', () => {
      const config = dashboard.pipelines
      expect(config[0]['name']).toEqual('saphyr')
      expect(config[0]['title']).toContain('Saphyr')
    })

    it('will have pacbio config', () => {
      const config = dashboard.pipelines
      expect(config[1]['name']).toEqual('pacbio')
      expect(config[1]['title']).toEqual('PacBio')
    })

    it('will have ont config', () => {
      const config = dashboard.pipelines
      expect(config[2]['name']).toEqual('ont')
      expect(config[2]['title']).toEqual('ONT')
    })
  })

  describe('for saphyr', () => {
    beforeEach(() => {
      box = wrapper.find('[data-pipeline=Saphyr]')
    })

    it('will have a title', () => {
      expect(box.find('[data-attribute=title]').text()).toEqual('Saphyr')
    })

    it('will have a description', () => {
      expect(box.find('[data-attribute=description]').text()).toBeDefined()
    })

    describe('route buttons', () => {
      it('will have a samples button', () => {
        const button = box.findAll('a').at(0)
        expect(button.text()).toEqual('Samples')
        button.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/saphyr/samples')
      })

      it('will have a libraries button', () => {
        const button = box.findAll('a').at(1)
        expect(button.text()).toEqual('Libraries')
        button.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/saphyr/libraries')
      })
      it('will have a runs button', () => {
        const button = box.findAll('a').at(2)
        expect(button.text()).toEqual('Runs')
        button.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/saphyr/runs')
      })
    })
  })

  describe('for pacbio', () => {
    beforeEach(() => {
      box = wrapper.find('[data-pipeline=PacBio]')
    })

    it('will have a title', () => {
      expect(box.find('[data-attribute=title]').text()).toEqual('PacBio')
    })

    it('will have a description', () => {
      expect(box.find('[data-attribute=description]').text()).toBeDefined()
    })

    describe('route buttons', () => {
      it('will have a plates button', () => {
        const platesButton = box.findAll('a').at(0)
        expect(platesButton.text()).toEqual('Plates')
        platesButton.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/pacbio/plates')
      })
      it('will have a samples button', () => {
        const button = box.findAll('a').at(1)
        expect(button.text()).toEqual('Samples')
        button.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/pacbio/samples')
      })
      it('will have a libraries button', () => {
        const button = box.findAll('a').at(2)
        expect(button.text()).toEqual('Libraries')
        button.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/pacbio/libraries')
      })
      it('will have a pools button', () => {
        const button = box.findAll('a').at(3)
        expect(button.text()).toEqual('Pools')
        button.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/pacbio/pools')
      })
      it('will have a runs button', () => {
        const button = box.findAll('a').at(4)
        expect(button.text()).toEqual('Runs')
        button.trigger('click')
        expect(wrapper.vm.$route.path).toBe('/pacbio/runs')
      })
    })
  })

  describe('for ont', () => {
    beforeEach(() => {
      box = wrapper.find('[data-pipeline=ONT]')
    })

    it('will have a title', () => {
      expect(box.find('[data-attribute=title]').text()).toEqual('ONT')
    })

    it('will have a description', () => {
      expect(box.find('[data-attribute=description]').text()).toBeDefined()
    })
  })
})

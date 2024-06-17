import TractionDashboard from '@/views/TractionDashboard'
import { mount, flushPromises, findByText } from '@support/testHelper'

describe('TractionDashboard.vue', () => {
  let wrapper, box, dashboard

  beforeEach(() => {
    wrapper = mount(TractionDashboard)
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
      it('will have buttons sorted by workflow', () => {
        const buttons = box.findAll('a')
        const buttonNames = buttons.map((button) => button.text())
        expect(buttonNames).toEqual(['Samples', 'Libraries', 'Runs'])
      })

      it('will have a samples button', async () => {
        const button = findByText(box, 'Samples')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/saphyr/samples')
      })

      it('will have a libraries button', async () => {
        const button = findByText(box, 'Libraries')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/saphyr/libraries')
      })

      it('will have a runs button', async () => {
        const button = findByText(box, 'Runs')
        button.trigger('click')
        await flushPromises()
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
      it('will have buttons sorted by workflow', () => {
        const buttons = box.findAll('a')
        const buttonNames = buttons.map((button) => button.text())
        expect(buttonNames).toEqual(['Plates', 'Samples', 'Libraries', 'Pools', 'Runs', 'Pool/new'])
      })

      it('will have a plates button', async () => {
        const button = findByText(box, 'Plates')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/pacbio/plates')
      })
      it('will have a samples button', async () => {
        const button = findByText(box, 'Samples')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/pacbio/samples')
      })
      it('will have a libraries button', async () => {
        const button = findByText(box, 'Libraries')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/pacbio/libraries')
      })
      it('will have a pools button', async () => {
        const button = findByText(box, 'Pools')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/pacbio/pools')
      })
      it('will have a runs button', async () => {
        const button = findByText(box, 'Runs')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/pacbio/runs')
      })
      it('will have a pool/new button', async () => {
        const button = findByText(box, 'Pool/new')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/pacbio/pool/new')
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

    describe('route buttons', () => {
      it('will have buttons sorted by workflow', () => {
        const buttons = box.findAll('a')
        const buttonNames = buttons.map((button) => button.text())
        expect(buttonNames).toEqual(['Samples', 'Pools', 'Pool/new', 'Runs'])
      })

      it('will have a samples button', async () => {
        const button = findByText(box, 'Samples')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/ont/samples')
      })
      it('will have a pools button', async () => {
        const button = findByText(box, 'Pools')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/ont/pools')
      })
      it('will have a pool/new button', async () => {
        const button = findByText(box, 'Pool/new')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/ont/pool/new')
      })
      it('will have a runs button', async () => {
        const button = findByText(box, 'Runs')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/ont/runs')
      })
    })
  })
})

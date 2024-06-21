import TractionDashboard from '@/views/TractionDashboard'
import PipelinesConfig from '@/config/PipelinesConfig'
import { mount, flushPromises } from '@support/testHelper'

describe('TractionDashboard.vue', () => {
  let wrapper, box, dashboard

  beforeEach(() => {
    wrapper = mount(TractionDashboard)
    dashboard = wrapper.vm
  })

  describe('pipelines', () => {
    it('will have same number of active pipelines in config', () => {
      const config = dashboard.pipelines
      const active_pipeline_count =  PipelinesConfig.filter(pipeline => pipeline.active).length
      expect(config.length).toEqual(active_pipeline_count)
    })

    it('will have the same active pipeline name in config', () => {
      const dashborad_pipelines = dashboard.pipelines
      const config_active_pipelines = PipelinesConfig.filter(pipeline => pipeline.active)

      const dashboard_pipeline_names = dashborad_pipelines.map(item => item.name)
      const config_pipeline_names = config_active_pipelines.map(pipeline=>pipeline.name )
      
      expect(dashboard_pipeline_names.length === config_pipeline_names.length)
      expect(dashboard_pipeline_names.every((value,index)=> value === config_pipeline_names[index]))
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
      it('will have a samples button', async () => {
        const button = box.findAll('a')[0]
        expect(button.text()).toEqual('Samples')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/saphyr/samples')
      })

      it('will have a libraries button', async () => {
        const button = box.findAll('a')[1]
        expect(button.text()).toEqual('Libraries')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/saphyr/libraries')
      })

      it('will have a runs button', async () => {
        const button = box.findAll('a')[2]
        expect(button.text()).toEqual('Runs')
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
      it('will have a plates button', async () => {
        const platesButton = box.findAll('a')[0]
        expect(platesButton.text()).toEqual('Plates')
        platesButton.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/pacbio/plates')
      })
      it('will have a samples button', async () => {
        const button = box.findAll('a')[1]
        expect(button.text()).toEqual('Samples')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/pacbio/samples')
      })
      it('will have a libraries button', async () => {
        const button = box.findAll('a')[2]
        expect(button.text()).toEqual('Libraries')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/pacbio/libraries')
      })
      it('will have a pools button', async () => {
        const button = box.findAll('a')[3]
        expect(button.text()).toEqual('Pools')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/pacbio/pools')
      })
      it('will have a runs button', async () => {
        const button = box.findAll('a')[4]
        expect(button.text()).toEqual('Runs')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/pacbio/runs')
      })
      it('will have a pool/new button', async () => {
        const button = box.findAll('a')[5]
        expect(button.text()).toEqual('Pool/new')
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
      it('will have a samples button', async () => {
        const button = box.findAll('a')[0]
        expect(button.text()).toEqual('Samples')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/ont/samples')
      })
      it('will have a pools button', async () => {
        const button = box.findAll('a')[1]
        expect(button.text()).toEqual('Pools')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/ont/pools')
      })
      it('will have a pool/new button', async () => {
        const button = box.findAll('a')[2]
        expect(button.text()).toEqual('Pool/new')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/ont/pool/new')
      })
      it('will have a runs button', async () => {
        const button = box.findAll('a')[3]
        expect(button.text()).toEqual('Runs')
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.path).toBe('/ont/runs')
      })
    })
  })
})

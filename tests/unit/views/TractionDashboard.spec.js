import TractionDashboard from '@/views/TractionDashboard'
import PipelinesConfig from '@/config/PipelinesConfig'
import { mount, flushPromises } from '@support/testHelper'

vi.mock('@/config/PipelinesConfig', () => {
  return {
    default: [
      {
        name: 'saphyr',
        title: 'Saphyr',
        description: 'A LIMS pipeline to support tracking for the Bionano Saphyr instrument',
        routes: ['samples', 'libraries', 'runs'],
        active: false,
      },
      {
        name: 'pacbio',
        title: 'PacBio',
        description: 'A LIMS pipeline to support tracking for PacBio Long-Read Sequencing',
        routes: ['plates', 'samples', 'libraries', 'pools', 'runs', 'pool/new'],
        active: true,
      },
      {
        name: 'ont',
        title: 'ONT',
        description: 'A LIMS pipeline to support tracking for ONT Long-Read Sequencing',
        routes: ['samples', 'pools', 'pool/new', 'runs'],
        active: true,
      },
    ],
  }
})

describe('TractionDashboard.vue', () => {
  let wrapper, box, dashboard
  const active_pipelines = PipelinesConfig.filter((pipeline) => pipeline.active)
  const active_pipeline_names = active_pipelines.map((pipeline) => pipeline.name)

  beforeEach(() => {
    wrapper = mount(TractionDashboard)
    dashboard = wrapper.vm
  })

  describe('pipelines', () => {
    it('will have the same number of active pipelines in config', () => {
      expect(dashboard.pipelines.length).toEqual(active_pipelines.length)
    })

    it('will have the same active pipeline name in config', () => {
      const dashboard_pipeline_names = dashboard.pipelines.map((pipeline) => pipeline.name)

      expect(dashboard_pipeline_names.length === active_pipeline_names.length)
      expect(
        dashboard_pipeline_names.every((value, index) => value === active_pipeline_names[index]),
      )
    })

    it('will exclude inactive pipelines', () => {
      const dashborad_pipelines_names = dashboard.pipelines.map((pipeline) => pipeline.name)
      const inactive_pipelines = PipelinesConfig.filter((pipeline) => !pipeline.active)
      const inactive_pipeline_names = inactive_pipelines.map((pipeline) => pipeline.name)

      inactive_pipeline_names.forEach((name) => {
        expect(dashborad_pipelines_names).not.toContain(name)
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

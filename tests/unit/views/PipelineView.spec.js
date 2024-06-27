import { mount, router, flushPromises } from '@support/testHelper'
import PipelineView from '@/views/PipelineView'

describe('PipelineView', () => {
  let wrapper, pipelineView, store

  beforeEach(async () => {
    wrapper = mount(PipelineView, { store, router, props: { pipeline: 'pacbio' } })
    await flushPromises()
    pipelineView = wrapper.vm
  })

  describe('show pipeline', () => {
    it('shows the current pipeline', () => {
      expect(wrapper.html()).toContain('PacBio')
    })
  })

  describe('#pipelineInfo', () => {
    it('has config for a pipeline', () => {
      const pipelineInfo = pipelineView.pipelineInfo
      expect(Object.keys(pipelineInfo)).toEqual([
        'name',
        'title',
        'description',
        'routes',
        'active',
      ])
    })
  })

  describe('#path', () => {
    it('returns the path for a given route, with the pipeline', () => {
      const path = pipelineView.path('testroute')
      expect(path).toEqual('/pacbio/testroute')
    })
  })
})

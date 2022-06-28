import { mount, localVue, router } from '@support/testHelper'
import PipelineView from '@/views/PipelineView'

describe('PipelineView', () => {
  let wrapper, pipelineView, store

  beforeEach(() => {
    wrapper = mount(PipelineView, { store, localVue, router, propsData: { pipeline: 'pacbio' } })
    pipelineView = wrapper.vm
  })

  describe('show pipeline', () => {
    it('shows the current pipeline', () => {
      expect(wrapper.html()).toContain('PacBio')
    })
  })

  describe('#pipelineInfo', () => {
    it('has config for a pipeline', () => {
      let pipelineInfo = pipelineView.pipelineInfo
      expect(Object.keys(pipelineInfo)).toEqual(['name', 'title', 'description', 'routes'])
    })
  })

  describe('#path', () => {
    it('returns the path for a given route, with the pipeline', () => {
      let path = pipelineView.path('testroute')
      expect(path).toEqual('/pacbio/testroute')
    })
  })
})

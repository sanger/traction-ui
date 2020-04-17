import { mount, localVue } from '../testHelper'
import PipelineView from '@/views/PipelineView'
import VueRouter from 'vue-router'

describe('PipelineView', () => {
  let wrapper, pipelineView, router, store

  beforeEach( () => {
    router = new VueRouter({
      routes: [
        { path: '/dashboard', name: 'Dashboard' },
        { path: '/saphyr/runs', name: 'SaphyrRuns' },
        { path: '/pacbio/runs', name: 'PacbioRuns' },
      ]
    })

    localStorage.setItem('pipeline', 'pacbio')

    wrapper = mount(PipelineView, { store, localVue, router })
    pipelineView = wrapper.vm
  })

  describe('show pipeline', () => {
    it('shows the current pipeline', () => {
      expect(wrapper.html()).toContain('Pacbio')
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
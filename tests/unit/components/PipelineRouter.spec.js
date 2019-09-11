import { mount, localVue } from '../testHelper'
import PipelineRouter from '@/components/PipelineRouter'
import VueRouter from 'vue-router'

describe('PipelineRouter.vue', () => {

  let wrapper, pipelineRouter, routes

  beforeEach(() => {
    routes = ['a','b','c','d']
    const router = new VueRouter({})
    wrapper = mount(PipelineRouter, {localVue, router, propsData: {routes: routes, pipeline: 'pipelineA'}})
    pipelineRouter = wrapper.vm
  })

  it('has the correct pipeline', () => {
    expect(pipelineRouter.pipeline).toEqual('pipelineA')
  })

  it('creates a nav bar', () => {
    expect(wrapper.find('nav')).toBeDefined()
  })

  it('has some routes', () => {
    expect(pipelineRouter.routes).toBeDefined()
  })

  describe('#routes', () => {
    it('will all be present in nav', () => {
      let links = wrapper.find('nav').findAll('a')
      let dashboard = links.wrappers.shift()
      expect(dashboard.attributes('href')).toEqual('#/dashboard')
      for (let i in pipelineRouter.routes) {
        expect(links.at(i).attributes('href')).toEqual(`#/pipelineA/${pipelineRouter.routes[i]}`)
      }
    })
  })

})

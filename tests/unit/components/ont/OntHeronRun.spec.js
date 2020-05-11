import OntHeronRun from '@/views/ont/OntHeronRun'
import ONTSVG from '@/components/svg/ONTSVG'
import OntFlowcell from '@/components/ont/OntFlowcell'
import { localVue, mount } from '../../testHelper'

describe('OntHeronRun.vue', () => {
  let wrapper, run

  beforeEach(() => {
    wrapper = mount(OntHeronRun, {
      localVue,
      stubs: {
        ONTSVG: true,
        OntFlowcell: true
      }
    })

    run = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('OntHeronRun')
  })

  describe('components', () => {
    it('has a OntFlowcell component', () => {
      expect(wrapper.contains(OntFlowcell)).toBe(true)
    })

    it('has a ONTSVG component', () => {
      expect(wrapper.contains(ONTSVG)).toBe(true)
    })
  })

  describe('ONT Flowcells', () => {
    it('has the correct number of flowcells', () => {
      let ellipses = wrapper.findAll(OntFlowcell)
      expect(ellipses.length).toEqual(5)
    })
  })

  describe('Create button', () => {
    it('has a create button', () => {
      expect(wrapper.find('#create-run').exists()).toBeTruthy()
    })

    it('calls createRun on click', () => {
      run.createRun = jest.fn()
      let button = wrapper.find('#create-run')
      button.trigger('click')
      expect(run.createRun).toBeCalled()
    })
  })

})
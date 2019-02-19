import { mount, localVue } from '../testHelper'
import FlowcellLibrary from '@/components/FlowcellLibrary'

describe('FlowcellLibrary.vue', () => {

  let wrapper, flowcellLibrary

  beforeEach(() => {
    wrapper = mount(FlowcellLibrary, { mocks: localVue })
    flowcellLibrary = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('FlowcellLibrary')
  })

})

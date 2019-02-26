import { mount, localVue } from '../testHelper'
import FlowcellLibrary from '@/components/FlowcellLibrary'

describe('FlowcellLibrary.vue', () => {

  let wrapper

  beforeEach(() => {
    wrapper = mount(FlowcellLibrary, { mocks: localVue })
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('FlowcellLibrary')
  })

})

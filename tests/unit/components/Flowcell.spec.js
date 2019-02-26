import { mount, localVue } from '../testHelper'
import Flowcell from '@/components/Flowcell'
import FlowcellLibrary from '@/components/FlowcellLibrary'

describe('Flowcell.vue', () => {

  let wrapper

  beforeEach(() => {
    wrapper = mount(Flowcell, { mocks: localVue })
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Flowcell')
  })

  it('will have a two flowcell libraries', () => {
    expect(wrapper.contains(FlowcellLibrary)).toBe(true)
  })

})

import NewRun from '@/views/NewRun'
import Flowcell from '@/components/Flowcell'
import { mount, localVue } from '../testHelper'
import DataList from '@/api/DataList'

describe('NewRun.vue', () => {

  let wrapper, data

  beforeEach(() => {
    wrapper = mount(NewRun, { localVue })
  })

  it('has a data list', () => {
    expect(wrapper.contains(DataList)).toBe(true)
  })

  it('has a flowcell component', () => {
    expect(wrapper.contains(Flowcell)).toBe(true)
  })

})

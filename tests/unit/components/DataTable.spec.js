import { mount, localVue } from '../testHelper'
import DataTable from '@/components/DataTable'
import Samples from '@/views/Samples'

describe('DataTable.vue', () => {

  let wrapper

  beforeEach(() => {
    wrapper = mount(DataTable, {
      mocks: localVue,
      slots: {
        default: Samples
      }
    })
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('DataTable')
  })

  describe('slot', () => {
    it("Samples component is inserted into slot", () => {
      expect(wrapper.contains(Samples)).toBe(true)
    });
  })
})

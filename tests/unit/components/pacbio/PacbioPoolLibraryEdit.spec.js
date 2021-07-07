import PacbioPoolLibraryEdit from '@/components/pacbio/PacbioPoolLibraryEdit'
import { mount, store } from 'testHelper'

const request = {
  id: '1',
  sample_name: "Sample1",
}

describe('PacbioPoolLibraryEdit.vue', () => {

  let wrapper

  beforeEach(() => {
    wrapper = mount(PacbioPoolLibraryEdit, {
      propsData: {
        request
      }
    })
  })

  it('will have a sample name', () => {
    expect(wrapper.find('[data-attribute=sample-name]').text()).toEqual('Sample1')
  })
})

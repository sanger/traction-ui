import PacbioPoolLibraryEdit from '@/components/pacbio/PacbioPoolLibraryEdit'
import { mount, store, localVue } from 'testHelper'

const request = {
  id: '1',
  sample_name: 'Sample1',
}

const tagSet = {
  id: '1',
  name: 'TagSet1',
  tags: [
    { id: '1', name: 'tag1' },
    { id: '2', name: 'tag2' },
    { id: '3', name: 'tag3' },
  ],
}

describe('PacbioPoolLibraryEdit.vue', () => {
  let wrapper

  beforeEach(() => {
    // TODO: This would probably better done using a separate component and an emit
    // but that is a bigger job
    store.state.traction.pacbio.poolCreate.selected.tagSet = tagSet

    wrapper = mount(PacbioPoolLibraryEdit, {
      store,
      localVue,
      propsData: {
        request,
      },
    })
  })

  it('will have an id', () => {
    expect(wrapper.vm.request).toEqual(request)
  })

  it('will have a sample name', () => {
    expect(wrapper.find('[data-attribute=sample-name]').text()).toEqual('Sample1')
  })

  it('will have a list of tags', () => {
    console.log(wrapper.vm.options)
    expect(wrapper.find('[data-type=tag-list]').findAll('option').length).toEqual(
      // will also include null value
      tagSet.tags.length + 1,
    )
  })

  it('will allow the user to select a tag', async () => {
    const options = wrapper.find('[data-type=tag-list]').findAll('option')
    await options.at(1).setSelected()
    expect(wrapper.vm.tag_id).toEqual('1')
  })
})

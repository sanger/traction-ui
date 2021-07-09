import PacbioPoolLibraryEdit from '@/components/pacbio/PacbioPoolLibraryEdit'
import { mount, store, localVue } from 'testHelper'

const request = {
  id: '1',
  sample_name: 'Sample1',
  source_identifier: 'DN1:A1',
}

const tagSet = {
  id: '1',
  name: 'TagSet1',
  tags: ['1', '2', '3'],
}

const tags = {
  1: { id: '1', group_id: 'tag1' },
  2: { id: '2', group_id: 'tag2' },
  3: { id: '3', group_id: 'tag3' },
}

// TODO: The tag list would probably better done using a separate component and an emit
// but that is a bigger job
describe('PacbioPoolLibraryEdit.vue', () => {
  let wrapper

  beforeEach(() => {
    store.state.traction.pacbio.poolCreate.resources.tagSets = { 1: tagSet }
    store.state.traction.pacbio.poolCreate.resources.tags = tags
    store.state.traction.pacbio.poolCreate.selected.tagSet = { id: tagSet.id }

    wrapper = mount(PacbioPoolLibraryEdit, {
      store,
      localVue,
      propsData: {
        request,
      },
    })
  })

  it('will have a request', () => {
    expect(wrapper.vm.request).toEqual(request)
  })

  it('will have a sample name', () => {
    expect(wrapper.find('[data-attribute=request-sample-name]').text()).toEqual('Sample1')
  })

  it('will have a source identifier', () => {
    expect(wrapper.find('[data-attribute=request-source-identifier]').text()).toEqual('DN1:A1')
  })

  it('will have a list of tags', () => {
    expect(wrapper.find('[data-type=tag-list]').findAll('option').length).toEqual(
      // will also include null value
      tagSet.tags.length + 1,
    )
  })

  it('each tag option will have some text', () => {
    expect(wrapper.vm.tagListOptions[1].text).not.toBeNull()
  })

  describe('when the user selects a tag', () => {
    it('will updated the tag_id', async () => {
      const options = wrapper.find('[data-type=tag-list]').findAll('option')
      await options.at(1).setSelected()
      expect(wrapper.vm.tag_id).toEqual('1')
    })
  })

  describe('input', () => {
    it('template prep kit box barcode id', async () => {
      const input = wrapper.find('[data-attribute=template-prep-kit-box-barcode]')
      await input.setValue('017865101789500022821')
      expect(wrapper.vm.template_prep_kit_box_barcode).toEqual('017865101789500022821')
    })

    it('volume', async () => {
      const input = wrapper.find('[data-attribute=volume]')
      await input.setValue('10.0')
      expect(wrapper.vm.volume).toEqual('10.0')
    })

    it('concentration', async () => {
      const input = wrapper.find('[data-attribute=concentration]')
      await input.setValue('2.4')
      expect(wrapper.vm.concentration).toEqual('2.4')
    })

    it('fragment size', async () => {
      const input = wrapper.find('[data-attribute=fragment_size]')
      await input.setValue('100')
      expect(wrapper.vm.fragment_size).toEqual('100')
    })
  })
})

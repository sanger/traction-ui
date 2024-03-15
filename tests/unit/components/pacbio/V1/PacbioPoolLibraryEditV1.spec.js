import PacbioPoolLibraryEdit from '@/components/pacbio/PacbioPoolLibraryEdit'
import { mount, store } from '@support/testHelper'
import { newLibrary } from '@/store/traction/pacbio/poolCreate/pool.js'

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

const library = newLibrary({ pacbio_request_id: '1' })

// TODO: The tag list would probably better done using a separate component and an emit
// but that is a bigger job
describe('PacbioPoolLibraryEdit.vue', () => {
  let wrapper

  beforeEach(() => {
    store.state.traction.pacbio.poolCreate.resources.tagSets = { 1: tagSet }
    store.state.traction.pacbio.poolCreate.resources.tags = tags
    store.state.traction.pacbio.poolCreate.selected.tagSet = { id: tagSet.id }
  })

  describe('valid', () => {
    beforeEach(() => {
      store.state.traction.pacbio.poolCreate.libraries = { _1: library }

      wrapper = mount(PacbioPoolLibraryEdit, {
        store,
        props: {
          id: 1,
          request,
          notify: () => {},
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

    it('will have an id', () => {
      expect(wrapper.vm.id).toEqual(1)
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
      it('will update the tag_id', async () => {
        const options = wrapper.find('[data-type=tag-list]').findAll('option')
        await options[1].setSelected()
        expect(store.state.traction.pacbio.poolCreate.libraries['_1'].tag_id).toEqual('1')
      })
    })

    describe('input', () => {
      it('template prep kit box barcode id', async () => {
        const input = wrapper.find('[data-attribute=template-prep-kit-box-barcode]')
        await input.setValue('017865101789500022821')
        expect(
          store.state.traction.pacbio.poolCreate.libraries['_1'].template_prep_kit_box_barcode,
        ).toEqual('017865101789500022821')
      })

      it('volume', async () => {
        const input = wrapper.find('[data-attribute=volume]')
        await input.setValue('10.0')
        expect(store.state.traction.pacbio.poolCreate.libraries['_1'].volume).toEqual('10.0')
      })

      it('concentration', async () => {
        const input = wrapper.find('[data-attribute=concentration]')
        await input.setValue('2.4')
        expect(store.state.traction.pacbio.poolCreate.libraries['_1'].concentration).toEqual('2.4')
      })

      it('insert size', async () => {
        const input = wrapper.find('[data-attribute=insert-size]')
        await input.setValue('100')
        expect(store.state.traction.pacbio.poolCreate.libraries['_1'].insert_size).toEqual('100')
      })
    })
  })

  describe('invalid', () => {
    const props = {
      id: 1,
      request,
      notify: () => {},
    }

    it('tag id', () => {
      store.state.traction.pacbio.poolCreate.libraries = {
        _1: { ...library, errors: { tag_id: 'must be present' } },
      }

      wrapper = mount(PacbioPoolLibraryEdit, {
        store,
        props,
      })

      expect(wrapper.find('[data-attribute=tag-id-error]').text()).toEqual('must be present')
    })

    it('volume', () => {
      store.state.traction.pacbio.poolCreate.libraries = {
        _1: { ...library, errors: { volume: 'must be present' } },
      }

      wrapper = mount(PacbioPoolLibraryEdit, {
        store,
        props,
      })

      expect(wrapper.find('[data-attribute=volume-error]').text()).toEqual('must be present')
    })

    it('concentration', () => {
      store.state.traction.pacbio.poolCreate.libraries = {
        _1: { ...library, errors: { concentration: 'must be present' } },
      }

      wrapper = mount(PacbioPoolLibraryEdit, {
        store,
        props,
      })

      expect(wrapper.find('[data-attribute=concentration-error]').text()).toEqual('must be present')
    })

    it('insert size', () => {
      store.state.traction.pacbio.poolCreate.libraries = {
        _1: { ...library, errors: { insert_size: 'must be present' } },
      }

      wrapper = mount(PacbioPoolLibraryEdit, {
        store,
        props,
      })

      expect(wrapper.find('[data-attribute=insert-size-error]').text()).toEqual('must be present')
    })
  })
})

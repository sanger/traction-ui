import OntPoolLibraryEdit from '@/components/ont/OntPoolLibraryEdit.vue'
import { mountWithStore } from '@support/testHelper.js'
import { newLibrary } from '@/store/traction/ont/pools/pool.js'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'
import { beforeEach } from 'vitest'

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

const props = { id: 1, request }

const library = newLibrary({ ont_request_id: '1' })

const mountComponent = (libraries = {}, props = {}) => {
  const { wrapper, store } = mountWithStore(OntPoolLibraryEdit, {
    initialState: {
      ontPoolCreate: {
        resources: {
          tagSets: { 1: tagSet },
          tags,
        },
        selected: {
          tagSet: { id: tagSet.id },
        },
        pooling: {
          libraries,
        },
      },
    },
    props,
    createStore: () => useOntPoolCreateStore(),
  })
  return { wrapper, store }
}

// but that is a bigger job
describe('OntPoolLibraryEdit.vue', () => {
  let wrapper, store

  describe('valid', () => {
    beforeEach(() => {
      ;({ wrapper, store } = mountComponent({ 1: library }, props))
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
      it('will updated the tag_id', async () => {
        const options = wrapper.find('[data-type=tag-list]').findAll('option')
        await options[1].setSelected()
        expect(store.pooling.libraries['1'].tag_id).toEqual('1')
      })
    })

    describe('input', () => {
      it('kit barcode id', async () => {
        const input = wrapper.find('[data-attribute=kit-barcode]')
        await input.setValue('017865101789500022821')
        expect(store.pooling.libraries['1'].kit_barcode).toEqual('017865101789500022821')
      })

      it('volume', async () => {
        const input = wrapper.find('[data-attribute=volume]')
        await input.setValue('10.0')
        expect(store.pooling.libraries['1'].volume).toEqual('10.0')
      })

      it('concentration', async () => {
        const input = wrapper.find('[data-attribute=concentration]')
        await input.setValue('2.4')
        expect(store.pooling.libraries['1'].concentration).toEqual('2.4')
      })

      it('insert size', async () => {
        const input = wrapper.find('[data-attribute=insert-size]')
        await input.setValue('100')
        expect(store.pooling.libraries['1'].insert_size).toEqual('100')
      })
    })
  })

  describe('invalid', () => {
    it('tag id', () => {
      const { wrapper } = mountComponent(
        { 1: { ...library, errors: { tag_id: 'must be present' } } },
        props,
      )
      expect(wrapper.find('[data-attribute=tag-id-error]').text()).toEqual('must be present')
    })

    it('volume', () => {
      const { wrapper } = mountComponent(
        { 1: { ...library, errors: { volume: 'must be present' } } },
        props,
      )
      expect(wrapper.find('[data-attribute=volume-error]').text()).toEqual('must be present')
    })

    it('concentration', () => {
      const { wrapper } = mountComponent(
        { 1: { ...library, errors: { concentration: 'must be present' } } },
        props,
      )
      expect(wrapper.find('[data-attribute=concentration-error]').text()).toEqual('must be present')
    })

    it('insert size', () => {
      const { wrapper } = mountComponent(
        { 1: { ...library, errors: { insert_size: 'must be present' } } },
        props,
      )
      expect(wrapper.find('[data-attribute=insert-size-error]').text()).toEqual('must be present')
    })
  })
})

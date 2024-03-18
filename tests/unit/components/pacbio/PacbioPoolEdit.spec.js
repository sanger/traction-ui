import { mount, nextTick, createTestingPinia } from '@support/testHelper.js'
import PacbioPoolEdit from '@/components/pacbio/PacbioPoolEdit.vue'
import { Data } from '@support/testHelper.js'
import * as pacbio from '@/lib/csv/pacbio.js'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'

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

/**
 * Helper method for mounting a component with a mock instance of pinia, with the given props.
 * This method also returns the wrapper and the store object for further testing.
 *
 * @param {*} - params to be passed to the createTestingPinia method for creating a mock instance of pinia
 * which includes
 * state - initial state of the store
 * stubActions - boolean to stub actions or not.
 * plugins - plugins to be used while creating the mock instance of pinia.
 */
function mountWithStore({ state = {}, stubActions = false, plugins = [], props } = {}) {
  const wrapperObj = mount(PacbioPoolEdit, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioPoolCreate: state,
          },
          stubActions,
          plugins,
        }),
      ],
    },
    props,
    stubs: {
      PacbioPoolLibraryList: true,
    },
  })
  const storeObj = usePacbioPoolCreateStore()
  return { wrapperObj, storeObj }
}

describe('pacbioPoolEdit#new', () => {
  const pool = {
    id: null,
    template_prep_kit_box_barcode: null,
    volume: null,
    concentration: null,
    insert_size: null,
  }

  let wrapper, store
  beforeEach(() => {
    const { wrapperObj, storeObj } = mountWithStore({ state: { pool } })
    wrapper = wrapperObj
    store = storeObj
  })

  describe('input', () => {
    it('template prep kit box barcode', async () => {
      const input = wrapper.find('[data-attribute=template-prep-kit-box-barcode]')
      await input.setValue('017865101789500022821')
      await wrapper.vm.$nextTick()
      expect(store.pool.template_prep_kit_box_barcode).toEqual('017865101789500022821')
    })

    it('volume', async () => {
      const input = wrapper.find('[data-attribute=volume]')
      await input.setValue('10.0')
      expect(store.pool.volume).toEqual('10.0')
    })

    it('concentration', async () => {
      const input = wrapper.find('[data-attribute=concentration]')
      await input.setValue('2.4')
      expect(store.pool.concentration).toEqual('2.4')
    })

    it('insert size', async () => {
      const input = wrapper.find('[data-attribute=insert-size]')
      await input.setValue('100')
      expect(store.pool.insert_size).toEqual('100')
    })
  })

  describe('submit button', () => {
    it('says Create pool', () => {
      const button = wrapper.find('[data-action=create-pool]')
      expect(button.text()).toContain('Create Pool')
    })

    it('does not have an update pool button', () => {
      const button = wrapper.find('[data-action=update-pool]')
      expect(button.exists()).toBe(false)
    })
  })
})

describe('pacbioPoolEdit#edit', () => {
  const pool = {
    id: '1',
    template_prep_kit_box_barcode: '017865101789500022821',
    volume: 10,
    concentration: 2.4,
    insert_size: 100,
  }

  const tube = {
    id: '1',
    barcode: 'TRAC-1',
  }

  let wrapper, store

  beforeEach(() => {
    const { wrapperObj, storeObj } = mountWithStore({
      state: { pool, tube, used_aliquots: {} },
    })
    wrapper = wrapperObj
    store = storeObj
  })

  describe('input', () => {
    it('template prep kit box barcode', async () => {
      const input = wrapper.find('[data-attribute=template-prep-kit-box-barcode]')
      expect(input.element.value).toEqual('017865101789500022821')
    })

    it('volume', async () => {
      const input = wrapper.find('[data-attribute=volume]')
      expect(input.element.value).toEqual('10')
    })

    it('concentration', async () => {
      const input = wrapper.find('[data-attribute=concentration]')
      expect(input.element.value).toEqual('2.4')
    })

    it('insert size', async () => {
      const input = wrapper.find('[data-attribute=insert-size]')
      expect(input.element.value).toEqual('100')
    })
  })

  describe('tube', () => {
    it('barcode', async () => {
      const barcode = wrapper.find('[data-attribute=barcode]')
      expect(barcode.text()).toContain('TRAC-1')
    })
  })

  describe('submit button', () => {
    it('says Update pool', () => {
      const button = wrapper.find('[data-action=update-pool]')
      expect(button.text()).toContain('Update Pool')
    })

    it('does not have a create pool button', () => {
      const button = wrapper.find('[data-action=create-pool]')
      expect(button.exists()).toBe(false)
    })
  })

  describe('uploadFile', () => {
    const spy = vi.spyOn(pacbio, 'eachRecord')
    const mockFile = {
      async text() {},
    }
    it('supports no files being selected', async () => {
      await wrapper.vm.uploadFile(null)
      expect(wrapper.vm.parsedFile).toEqual(null)
    })

    it('highlights a valid file', async () => {
      spy.mockImplementation(() => {})
      const event = { target: { files: [mockFile] } }
      await wrapper.vm.uploadFile(event)
      expect(wrapper.vm.parsedFile).toEqual(true)
    })

    it('highlights a invalid file', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {})
      spy.mockImplementation(() => {
        throw 'Toys'
      })
      const event = { target: { files: [mockFile] } }
      await wrapper.vm.uploadFile(event)
      expect(wrapper.vm.parsedFile).toEqual(false)
    })
  })

  describe('pool type', () => {
    beforeEach(() => {
      const rootStore = usePacbioRootStore()
      rootStore.tagSets = { 1: tagSet }
      rootStore.tags = tags
    })
    it('says empty when there are no used_aliquots', async () => {
      const poolCreateStore = Object.assign({}, Data.AutoTagStore, {
        used_aliquots: {},
      })
      store.$state = poolCreateStore
      await nextTick()
      expect(wrapper.find('[data-attribute=pool-type]').text()).toContain('Empty')
    })

    // it('says library when there is one library', async () => {
    //   const poolCreateStore = Object.assign({}, Data.AutoTagStore, {
    //     used_aliquots: { _1: createUsedAliquot({ source_id: '1' }) },
    //   })
    //   store.$state = poolCreateStore
    //   store.selected.tagSet.id = '1'
    //   await nextTick()
    //   expect(wrapper.find('[data-attribute=pool-type]').text()).toContain('Library')
    // })

    it('says pool when there are multiple libraries', async () => {
      store.$state = Data.AutoTagStore
      store.selected.tagSet.id = '1'
      await nextTick()
      expect(wrapper.find('[data-attribute=pool-type]').text()).toContain('Pool')
    })
  })
})

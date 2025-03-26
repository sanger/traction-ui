import { mountWithStore, nextTick } from '@support/testHelper.js'
import PacbioPoolEdit from '@/components/pacbio/PacbioPoolEdit.vue'
import * as pacbio from '@/lib/csv/pacbio.js'
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'
import PacbioAutoTagFactory from '@tests/factories/PacbioAutoTagFactory'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'

const pacbioAutoTagFactory = PacbioAutoTagFactory()

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

const mountPacbioPoolEdit = ({ state = {}, props } = {}) =>
  mountWithStore(PacbioPoolEdit, {
    initialState: {
      pacbioPoolCreate: state,
    },
    props,
    stubs: {
      PacbioPoolLibraryList: true,
    },
    createStore: () => usePacbioPoolCreateStore(),
  })

vi.mock('swrv', () => ({
  default: vi.fn(() => ({
    data: {
      features: {},
    },
  })),
}))

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
    ;({ wrapper, store } = mountPacbioPoolEdit({ state: { pool } }))
  })

  describe('input', () => {
    it('template prep kit box barcode', async () => {
      const input = wrapper.find('[data-attribute=template-prep-kit-box-barcode]')
      await input.setValue('017865101789500022821')
      await wrapper.vm.$nextTick()
      expect(store.pool.template_prep_kit_box_barcode).toEqual('017865101789500022821')
      expect(store.validatePoolAttribute).toBeCalled()
    })

    it('volume', async () => {
      const input = wrapper.find('[data-attribute=volume]')
      await input.setValue('10.0')
      expect(store.pool.volume).toEqual('10.0')
      expect(store.validatePoolAttribute).toBeCalled()
    })

    it('concentration', async () => {
      const input = wrapper.find('[data-attribute=concentration]')
      await input.setValue('2.4')
      expect(store.pool.concentration).toEqual('2.4')
      expect(store.validatePoolAttribute).toBeCalled()
    })

    it('insert size', async () => {
      const input = wrapper.find('[data-attribute=insert-size]')
      await input.setValue('100')
      expect(store.pool.insert_size).toEqual('100')
      expect(store.validatePoolAttribute).toBeCalled()
    })
  })

  describe('when inputs are invalid', () => {
    it('volume', async () => {
      ;({ wrapper, store } = mountPacbioPoolEdit({
        state: {
          pool: {
            ...pool,
            volume: null,
            errors: {
              volume: 'must be present',
            },
          },
        },
      }))
      await nextTick()

      expect(wrapper.find('[data-attribute=pool-volume-error]').text()).toEqual('must be present')
    })

    it('volume', async () => {
      ;({ wrapper, store } = mountPacbioPoolEdit({
        state: {
          pool: {
            ...pool,
            volume: 5,
            used_volume: 10,
            errors: {
              volume: 'must be greater than used volume',
            },
          },
        },
      }))
      await nextTick()

      expect(wrapper.find('[data-attribute=pool-volume-error]').text()).toEqual(
        'must be greater than used volume',
      )
    })

    it('concentration', async () => {
      ;({ wrapper, store } = mountPacbioPoolEdit({
        state: {
          pool: {
            ...pool,
            concentration: null,
            errors: {
              concentration: 'must be present',
            },
          },
        },
      }))
      await nextTick()

      expect(wrapper.find('[data-attribute=pool-concentration-error]').text()).toEqual(
        'must be present',
      )
    })

    it('insert size', async () => {
      ;({ wrapper, store } = mountPacbioPoolEdit({
        state: {
          pool: {
            ...pool,
            insert_size: null,
            errors: {
              insert_size: 'must be present',
            },
          },
        },
      }))
      await nextTick()
      expect(wrapper.find('[data-attribute=pool-insert_size-error]').text()).toEqual(
        'must be present',
      )
    })

    it('template prep kit box barcode', async () => {
      ;({ wrapper, store } = mountPacbioPoolEdit({
        state: {
          pool: {
            ...pool,
            template_prep_kit_box_barcode: null,
            errors: {
              template_prep_kit_box_barcode: 'must be present',
            },
          },
        },
      }))
      await nextTick()

      expect(
        wrapper.find('[data-attribute=pool-template-prep-kit-box-barcode-error]').text(),
      ).toEqual('must be present')
    })
  })

  describe('when inputs are valid', () => {
    it('no errors are displayed', async () => {
      store.pool = {
        volume: 10,
        used_volume: 5,
        insert_size: 100,
        concentration: 2.4,
        template_prep_kit_box_barcode: '017865101789500022821',
      }
      await nextTick()

      expect(wrapper.find('[data-attribute=pool-volume-error]').exists()).toBe(false)
      expect(wrapper.find('[data-attribute=pool-insert_size-error]').exists()).toBe(false)
      expect(
        wrapper.find('[data-attribute=pool-template_prep_kit_box_barcode-error]').exists(),
      ).toBe(false)
      expect(wrapper.find('[data-attribute=pool-concentration-error]').exists()).toBe(false)
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
    used_volume: 2,
    barcode: 'TRAC-1',
  }

  let wrapper, store

  beforeEach(() => {
    ;({ wrapper, store } = mountPacbioPoolEdit({
      state: { pool, used_aliquots: {} },
    }))
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

    it('used volume', async () => {
      expect(wrapper.find('#pool-used-volume').text()).toContain('2')
      expect(wrapper.find('#tooltip-div').exists()).toBeTruthy()
    })
  })

  describe('when inputs are invalid', () => {
    it('displays an error when itemplate prep kit box barcode is not present', async () => {
      const input = wrapper.find('[data-attribute=template-prep-kit-box-barcode]')
      await input.setValue('')
      await nextTick()
      expect(
        wrapper.find('[data-attribute=pool-template-prep-kit-box-barcode-error]').text(),
      ).toContain('must be present')
    })
    it('displays an error when concentration is not present', async () => {
      const input = wrapper.find('[data-attribute=concentration]')
      await input.setValue('')
      await nextTick()
      expect(wrapper.find('[data-attribute=pool-concentration-error]').text()).toContain(
        'must be present',
      )
    })
    it('displays an error when insert size is not present', async () => {
      const input = wrapper.find('[data-attribute=insert-size]')
      await input.setValue('')
      await nextTick()
      expect(wrapper.find('[data-attribute=pool-insert_size-error]').text()).toContain(
        'must be present',
      )
    })
    it('displays an error when volume is not present', async () => {
      const input = wrapper.find('[data-attribute=volume]')
      await input.setValue('')
      await nextTick()
      expect(wrapper.find('[data-attribute=pool-volume-error]').text()).toContain('must be present')
    })
    it('displays an error when the volume is less than the used volume', async () => {
      const input = wrapper.find('[data-attribute=volume]')
      await input.setValue('1')
      await nextTick()
      expect(wrapper.find('[data-attribute=pool-volume-error]').text()).toContain(
        'must be greater than used volume',
      )
    })
  })

  describe('pool barcode', () => {
    it('is present', async () => {
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
      const poolCreateStore = Object.assign({}, pacbioAutoTagFactory.storeData, {
        used_aliquots: {},
      })
      store.$state = poolCreateStore
      await nextTick()
      expect(wrapper.find('[data-attribute=pool-type]').text()).toContain('Empty')
    })
    it('says pool when there are multiple libraries', async () => {
      store.$state = pacbioAutoTagFactory.storeData
      store.selected.tagSet.id = '1'
      await nextTick()
      expect(wrapper.find('[data-attribute=pool-type]').text()).toContain('Pool')
    })
  })
})

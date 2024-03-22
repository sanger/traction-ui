import { mount, store, nextTick } from '@support/testHelper'
import PacbioPoolEdit from '@/components/pacbio/PacbioPoolEdit'
import { newLibrary } from '@/store/traction/pacbio/poolCreate/pool.js'
import { Data } from '@support/testHelper'
import * as pacbio from '@/lib/csv/pacbio'

const buildWrapper = () =>
  mount(PacbioPoolEdit, {
    stubs: {
      PacbioPoolLibraryList: true,
    },
    store,
  })

describe('pacbioPoolEdit#new', () => {
  const pool = {
    id: null,
    template_prep_kit_box_barcode: null,
    volume: null,
    concentration: null,
    insert_size: null,
  }

  let wrapper
  beforeEach(() => {
    wrapper = buildWrapper()
    store.state.traction.pacbio.poolCreate.pool = pool
  })

  describe('input', () => {
    it('template prep kit box barcode', async () => {
      const input = wrapper.find('[data-attribute=template-prep-kit-box-barcode]')
      await input.setValue('017865101789500022821')
      expect(store.state.traction.pacbio.poolCreate.pool.template_prep_kit_box_barcode).toEqual(
        '017865101789500022821',
      )
    })

    it('volume', async () => {
      const input = wrapper.find('[data-attribute=volume]')
      await input.setValue('10.0')
      expect(store.state.traction.pacbio.poolCreate.pool.volume).toEqual('10.0')
    })

    it('concentration', async () => {
      const input = wrapper.find('[data-attribute=concentration]')
      await input.setValue('2.4')
      expect(store.state.traction.pacbio.poolCreate.pool.concentration).toEqual('2.4')
    })

    it('insert size', async () => {
      const input = wrapper.find('[data-attribute=insert-size]')
      await input.setValue('100')
      expect(store.state.traction.pacbio.poolCreate.pool.insert_size).toEqual('100')
    })
  })

  describe('when inputs are invalid', () => {
    it('volume', async () => {
      store.state.traction.pacbio.poolCreate.pool = {
        ...pool,
        volume: null,
        errors: {
          volume: 'must be present',
        },
      }
      await nextTick()

      expect(wrapper.find('[data-attribute=volume-error]').text()).toEqual('must be present')
    })

    it('concentration', async () => {
      store.state.traction.pacbio.poolCreate.pool = {
        ...pool,
        concentration: null,
        errors: {
          concentration: 'must be present',
        },
      }
      await nextTick()

      expect(wrapper.find('[data-attribute=concentration-error]').text()).toEqual('must be present')
    })

    it('insert size', async () => {
      store.state.traction.pacbio.poolCreate.pool = {
        ...pool,
        insert_size: null,
        errors: {
          insert_size: 'must be present',
        },
      }
      await nextTick()

      expect(wrapper.find('[data-attribute=insert_size-error]').text()).toEqual('must be present')
    })

    it('template prep kit box barcode', async () => {
      store.state.traction.pacbio.poolCreate.pool = {
        ...pool,
        template_prep_kit_box_barcode: null,
        errors: {
          template_prep_kit_box_barcode: 'must be present',
        },
      }
      await nextTick()

      expect(wrapper.find('[data-attribute=template_prep_kit_box_barcode-error]').text()).toEqual(
        'must be present',
      )
    })
  })

  describe('when inputs are valid', () => {
    it('no errors are displayed', async () => {
      store.state.traction.pacbio.poolCreate.pool = {
        volume: 0,
        insert_size: 100,
        concentration: 2.4,
        template_prep_kit_box_barcode: '017865101789500022821',
      }
      await nextTick()

      expect(wrapper.find('[data-attribute=volume-error]').exists()).toBe(false)
      expect(wrapper.find('[data-attribute=insert_size-error]').exists()).toBe(false)
      expect(wrapper.find('[data-attribute=template_prep_kit_box_barcode-error]').exists()).toBe(false)
      expect(wrapper.find('[data-attribute=concentration-error]').exists()).toBe(false)
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

  let wrapper

  beforeEach(() => {
    wrapper = buildWrapper()
    store.state.traction.pacbio.poolCreate.libraries = {}
    store.state.traction.pacbio.poolCreate.pool = pool
    store.state.traction.pacbio.poolCreate.tube = tube
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
    it('says empty when there are no libraries', async () => {
      const poolCreateStore = Object.assign({}, Data.AutoTagStoreV1, {
        libraries: {},
      })
      store.state.traction.pacbio.poolCreate = poolCreateStore
      await nextTick()
      expect(wrapper.find('[data-attribute=pool-type]').text()).toContain('Empty')
    })

    it('says library when there is one library', async () => {
      const poolCreateStore = Object.assign({}, Data.AutoTagStoreV1, {
        libraries: { _1: newLibrary({ pacbio_request_id: '1' }) },
      })
      store.state.traction.pacbio.poolCreate = poolCreateStore
      await nextTick()
      expect(wrapper.find('[data-attribute=pool-type]').text()).toContain('Library')
    })

    it('says pool when there are multiple libraries', async () => {
      store.state.traction.pacbio.poolCreate = Data.AutoTagStoreV1
      await nextTick()
      expect(wrapper.find('[data-attribute=pool-type]').text()).toContain('Pool')
    })
  })
})

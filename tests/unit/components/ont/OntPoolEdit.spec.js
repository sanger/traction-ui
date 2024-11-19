import { mount, store, nextTick } from '@support/testHelper'
import OntPoolEdit from '@/components/ont/OntPoolEdit'
import { newLibrary } from '@/store/traction/ont/pools/pool.js'
import { expect } from 'vitest'
// ?? huh. Pacbio?
import * as pacbio from '@/lib/csv/pacbio'
import OntAutoTagFactory from '@tests/factories/OntAutoTagFactory'

const ontAutoTagFactory = OntAutoTagFactory()

const buildWrapper = () =>
  mount(OntPoolEdit, {
    stubs: {
      OntPoolLibraryList: true,
    },
    store,
  })

describe('ontPoolEdit#new', () => {
  const pool = {
    id: null,
    kit_barcode: null,
    volume: null,
    concentration: null,
    insert_size: null,
  }

  let wrapper
  beforeEach(() => {
    wrapper = buildWrapper()
    store.state.traction.ont.pools.pooling.pool = pool
  })

  describe('input', () => {
    it('kit barcode', async () => {
      const input = wrapper.find('[data-attribute=kit-barcode]')
      await input.setValue('017865101789500022821')
      expect(store.state.traction.ont.pools.pooling.pool.kit_barcode).toEqual(
        '017865101789500022821',
      )
    })

    it('volume', async () => {
      const input = wrapper.find('[data-attribute=volume]')
      await input.setValue('10.0')
      expect(store.state.traction.ont.pools.pooling.pool.volume).toEqual('10.0')
    })

    it('concentration', async () => {
      const input = wrapper.find('[data-attribute=concentration]')
      await input.setValue('2.4')
      expect(store.state.traction.ont.pools.pooling.pool.concentration).toEqual('2.4')
    })

    it('insert size', async () => {
      const input = wrapper.find('[data-attribute=insert-size]')
      await input.setValue('100')
      expect(store.state.traction.ont.pools.pooling.pool.insert_size).toEqual('100')
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

describe('ontPoolEdit#edit', () => {
  const pool = {
    id: '1',
    kit_barcode: '017865101789500022821',
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
    store.state.traction.ont.pools.pooling.libraries = {}
    store.state.traction.ont.pools.pooling.pool = pool
    store.state.traction.ont.pools.pooling.tube = tube
  })

  describe('input', () => {
    it('kit barcode', async () => {
      const input = wrapper.find('[data-attribute=kit-barcode]')
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
      const poolCreateStore = Object.assign({}, ontAutoTagFactory.storeData, {
        pooling: {
          libraries: {},
          pool: {},
          tube: {},
        },
      })
      store.state.traction.ont.pools = poolCreateStore
      await nextTick()
      expect(wrapper.find('[data-attribute=pool-type]').text()).toContain('Empty')
    })

    it('says library when there is one library', async () => {
      const poolCreateStore = Object.assign({}, ontAutoTagFactory.storeData, {
        pooling: {
          tube: {},
          libraries: { 1: newLibrary({ ont_request_id: '1' }) },
          pool: {},
        },
      })
      store.state.traction.ont.pools = poolCreateStore
      await nextTick()
      expect(wrapper.find('[data-attribute=pool-type]').text()).toContain('Library')
    })

    it('says pool when there are multiple libraries', async () => {
      expect(wrapper.find('[data-attribute=pool-type]').text()).toContain('Pool')
    })
  })
})

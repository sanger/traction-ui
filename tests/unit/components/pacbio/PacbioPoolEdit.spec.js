import { mount, localVue, store } from '@support/testHelper'
import PacbioPoolEdit from '@/components/pacbio/PacbioPoolEdit'
import { newLibrary } from '@/store/traction/pacbio/poolCreate/pool.js'
import { Data } from '@support/testHelper'
import * as Library from '@/lib/csv/pacbio'

const buildWrapper = () =>
  mount(PacbioPoolEdit, {
    localVue,
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
    it('triggers readAsText() on file selection', async () => {
      const fileInput = wrapper.find('#qcFileInput')
      const mockFile = new File(['file content'], 'mock_file.csv', { type: 'csv' })

      const fileReader = {
        readAsText: vi.fn(),
      }
      const fileList = {
        length: 1,
        item: () => mockFile,
      }

      // set a spy on FileReader and replace with fileReader mock when called
      vi.spyOn(window, 'FileReader').mockImplementation(() => fileReader)

      // files property of fileInput.element is defined as fileList
      Object.defineProperty(fileInput.element, 'files', {
        value: fileList,
        writable: true,
      })

      fileInput.trigger('change')
      expect(fileReader.readAsText).toBeCalled()
    })

    it('sets the parsedFile true for a valid file', async() => {
      const fileInput = wrapper.find('#qcFileInput')
      const mockFile = new File(['file content'], 'mock_file.csv', { type: 'csv' })
      const eachRecord = vi.spyOn(Library, 'eachRecord').mockResolvedValue(
      []
    )
      const fileReader = {
        readAsText: vi.fn(),
      }
      const fileList = {
        length: 1,
        item: () => mockFile,
      }
      vi.spyOn(window, 'FileReader').mockImplementation(() => fileReader)
      Object.defineProperty(fileInput.element, 'files', {
        value: fileList,
        writable: true,
      })
      let onloadRef
      Object.defineProperty(fileReader, 'onload', {
        get() {
          return this._onload
        },
        set(onload) {
          onloadRef = onload
          this._onload = onload
        },
      })
      fileInput.trigger('change')
      await wrapper.vm.$nextTick()
      const event = { target: { result: mockFile } }
      await onloadRef(event)
      expect(eachRecord).toBeCalled()
      expect(wrapper.vm.parsedFile).toBe(true)
    } )

    it('returns no border when parsedFile is null', async () => {
      wrapper.parsedFile = null
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.border).toContain('border-0')
    })

    it('returns green border when parsedFile is true', async () => {
      wrapper.vm.parsedFile = true
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.border).toEqual('rounded border border-green-500')
    })

    it('returns green border when parsedFile is false', async () => {
      wrapper.vm.parsedFile = false
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.border).toEqual('rounded border border-red-500')
    })
  })

  describe('pool type', () => {
    it('says empty when there are no libraries', async () => {
      const poolCreateStore = Object.assign({}, Data.AutoTagStore, {
        libraries: {},
      })
      store.state.traction.pacbio.poolCreate = poolCreateStore
      await localVue.nextTick()
      expect(wrapper.find('[data-attribute=pool-type]').text()).toContain('Empty')
    })

    it('says library when there is one library', async () => {
      const poolCreateStore = Object.assign({}, Data.AutoTagStore, {
        libraries: { _1: newLibrary({ pacbio_request_id: '1' }) },
      })
      store.state.traction.pacbio.poolCreate = poolCreateStore
      await localVue.nextTick()
      expect(wrapper.find('[data-attribute=pool-type]').text()).toContain('Library')
    })

    it('says pool when there are multiple libraries', async () => {
      store.state.traction.pacbio.poolCreate = Data.AutoTagStore
      await localVue.nextTick()
      expect(wrapper.find('[data-attribute=pool-type]').text()).toContain('Pool')
    })
  })
})

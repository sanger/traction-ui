import PacbioPoolIndex from '@/views/pacbio/PacbioPoolIndex.vue'
import { mountWithStore, router, flushPromises } from '@support/testHelper'
import { usePacbioPoolsStore } from '@/stores/pacbioPools.js'
import PacbioPoolFactory from '@tests/factories/PacbioPoolFactory.js'
import PrinterFactory from '@tests/factories/PrinterFactory.js'

const pacbioPoolFactory = PacbioPoolFactory()
const printerFactory = PrinterFactory()

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))
const mockFetchLocations = vi.fn().mockResolvedValue([])
vi.mock('@/composables/useLocationFetcher.js', () => ({
  default: () => ({
    fetchLocations: mockFetchLocations,
  }),
}))

const mockFetchLocations = vi.fn(() => [])
vi.mock('@/composables/useLocationFetcher.js', () => ({
  default: () => ({
    fetchLocations: mockFetchLocations,
  }),
}))

describe('PacbioPoolIndex.vue', () => {
  let wrapper, pools

  beforeEach(async () => {
    const plugins = [
      ({ store }) => {
        if (store.$id === 'root') {
          store.api.traction.pacbio.pools.get = vi
            .fn()
            .mockResolvedValue(pacbioPoolFactory.responses.fetch)
          // a bit of a smell. Printing is hidden
          store.api.traction.printers.get = vi
            .fn()
            .mockResolvedValue(printerFactory.responses.fetch)
        }
      },
    ]

    ;({ wrapper } = mountWithStore(PacbioPoolIndex, {
      plugins,
      createStore: () => usePacbioPoolsStore(),
    }))
    await flushPromises()
    pools = wrapper.vm
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      const headers = wrapper.findAll('th')
      for (const field of pools.state.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(4)
    })
  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      pools.showAlert('show this message', 'danger')
      expect(mockShowAlert).toBeCalledWith('show this message', 'danger')
    })
  })

  describe('Edit button', () => {
    let button

    it('is present for each pool', () => {
      button = wrapper.find('#editPool-1')
      expect(button.text()).toEqual('Edit')
    })

    it('on click show it shows the pool edit page', async () => {
      button = wrapper.find('#editPool-1')
      button.trigger('click')
      await flushPromises()
      expect(router.currentRoute.value.path).toBe('/pacbio/pool/1')
    })
  })

  describe('Printing labels', () => {
    beforeEach(() => {
      pools.state.selected = [
        { id: 1, barcode: 'TRAC-2-1', source_identifier: 'SQSC-1' },
        { id: 2, barcode: 'TRAC-2-2', source_identifier: 'SQSC-2' },
        { id: 3, barcode: 'TRAC-2-3', source_identifier: 'SQSC-2' },
      ]
    })

    describe('#createLabels', () => {
      it('will have the correct number of labels', () => {
        expect(pools.createLabels().length).toEqual(3)
      })

      it('will have the correct text for each label', () => {
        const label = pools.createLabels()[0]
        expect(label.barcode).toEqual('TRAC-2-1')
        expect(label.first_line).toEqual('Pacbio - Pool')
        expect(/\d{2}-\w{3}-\d{2}/g.test(label.second_line)).toBeTruthy()
        expect(label.third_line).toEqual('TRAC-2-1')
        expect(label.fourth_line).toEqual('SQSC-1')
        expect(label.round_label_bottom_line).toEqual('1')
        expect(label.round_label_lower_line).toEqual('TRAC-2')
        expect(label.label_name).toEqual('main_label')
      })
    })

    describe('#printLabels', () => {
      beforeEach(() => {
        const mockPrintJob = vi.fn().mockResolvedValue({ success: true, message: 'success' })
        wrapper.vm.printingStore.createPrintJob = mockPrintJob
        const modal = wrapper.findComponent({ ref: 'printerModal' })
        modal.vm.$emit('selectPrinter', 'printer1')
      })

      it('should create a print job', () => {
        expect(wrapper.vm.printingStore.createPrintJob).toBeCalledWith({
          printerName: 'printer1',
          labels: pools.createLabels(),
          copies: 1,
        })
        expect(mockShowAlert).toBeCalledWith('success', 'success')
      })
    })
  })
})

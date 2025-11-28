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
const mockPrintLabels = vi.fn()
vi.mock('@/composables/useTubePrint.js', () => ({
  default: () => ({
    printLabels: mockPrintLabels,
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
    describe('#onPrintAction', () => {
      beforeEach(() => {
        pools = wrapper.vm
        pools.state.selected = [
          { id: 1, barcode: 'TRAC-1', source_identifier: 'SQSC-1' },
          { id: 2, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
          { id: 3, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
        ]
      })

      it('creates a print job and shows a success alert', async () => {
        mockPrintLabels.mockResolvedValue({
          success: true,
          message: 'Barcode(s) successfully printed',
        })
        const modal = wrapper.findComponent({ ref: 'printerModal' })
        // Modal emit triggers onPrintAction
        modal.vm.$emit('selectPrinter', 'printer1')
        await flushPromises()

        expect(mockPrintLabels).toBeCalledWith(
          'printer1',
          [
            { id: 1, barcode: 'TRAC-1', source_identifier: 'SQSC-1' },
            { id: 2, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
            { id: 3, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
          ],
          'Pacbio - Pool',
        )
        expect(mockShowAlert).toBeCalledWith('Barcode(s) successfully printed', 'success')
      })
    })
  })
})

import ONTPoolIndex from '@/views/ont/ONTPoolIndex.vue'
import { flushPromises, mountWithStore } from '@support/testHelper.js'
import { vi } from 'vitest'
import OntPoolFactory from '@tests/factories/OntPoolFactory.js'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'

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
const ontPoolFactory = OntPoolFactory.all()

const mountComponent = () => {
  const plugins = [
    ({ store }) => {
      if (store.$id === 'root') {
        store.api.traction.ont.pools.get = vi.fn().mockResolvedValue(ontPoolFactory.responses.fetch)
      }
    },
  ]
  const { wrapper } = mountWithStore(ONTPoolIndex, {
    plugins,
    createStore: () => useOntPoolCreateStore(),
    stubs: {
      PrinterModal: {
        template: '<div ref="printerModal"></div>',
      },
    },
  })
  return wrapper
}

describe('OntPoolIndex', () => {
  let wrapper, pools

  beforeEach(async () => {
    wrapper = mountComponent()
    await flushPromises()
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      const headers = wrapper.findAll('th')
      for (const field of wrapper.vm.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('displays each of the requests', async () => {
      const expectedPools = ontPoolFactory.content.data.length
      expect(wrapper.findAll('tr').length).toEqual(expectedPools + 1)
    })
  })

  describe('Printing labels', () => {
    describe('#onPrintAction', () => {
      beforeEach(() => {
        pools = wrapper.vm
        pools.selected = [
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
          'Ont - Pool',
        )
        expect(mockShowAlert).toBeCalledWith('Barcode(s) successfully printed', 'success')
      })
    })
  })
})

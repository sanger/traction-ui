import ONTPoolIndex from '@/views/ont/ONTPoolIndex.vue'
import { flushPromises, mountWithStore } from '@support/testHelper.js'
import { vi } from 'vitest'
import OntPoolFactory from '@tests/factories/OntPoolFactory.js'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'

const mockFetchLocations = vi.fn().mockResolvedValue([])
vi.mock('@/composables/useLocationFetcher.js', () => ({
  default: () => ({
    fetchLocations: mockFetchLocations,
  }),
}))
const ontPoolFactory = OntPoolFactory()

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
    beforeEach(() => {
      pools = wrapper.vm
      pools.selected = [
        { id: 1, barcode: 'TRAC-1', source_identifier: 'SQSC-1' },
        { id: 2, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
        { id: 3, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
      ]
    })

    describe('#createLabels', () => {
      it('will have the correct number of labels', () => {
        expect(pools.createLabels().length).toEqual(3)
      })

      it('will have the correct text for each label', () => {
        const label = pools.createLabels()[0]
        expect(label.barcode).toEqual('TRAC-1')
        expect(label.first_line).toEqual('Ont - Pool')
        expect(/\d{2}-\w{3}-\d{2}/g.test(label.second_line)).toBeTruthy()
        expect(label.third_line).toEqual('TRAC-1')
        expect(label.fourth_line).toEqual('SQSC-1')
        expect(label.label_name).toEqual('main_label')
      })
    })

    describe('#printLabels', () => {
      beforeEach(() => {
        pools.printingStore.createPrintJob = vi.fn().mockImplementation(() => {
          return { success: true, message: 'success' }
        })

        const modal = wrapper.findComponent({ ref: 'printerModal' })
        modal.vm.$emit('selectPrinter', 'printer1')
      })

      it('should create a print job', () => {
        expect(pools.printingStore.createPrintJob).toBeCalledWith({
          printerName: 'printer1',
          labels: pools.createLabels(),
          copies: 1,
        })
      })
    })
  })
})

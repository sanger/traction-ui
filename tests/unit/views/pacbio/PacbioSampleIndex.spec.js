import PacbioSampleIndex from '@/views/pacbio/PacbioSampleIndex.vue'
import { createTestingPinia, flushPromises, mount } from '@support/testHelper.js'
import { beforeEach, describe, expect, it } from 'vitest'
import PacbioRequestFactory from '@tests/factories/PacbioRequestFactory.js'
import { usePacbioRequestsStore } from '@/stores/pacbioRequests.js'

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

function mountWithStore({ props, state = {}, stubActions = false, plugins =[] } = {}) {
  const wrapperObj = mount(PacbioSampleIndex, {
    global: {
      plugins: [
        createTestingPinia({
          state,
          plugins,
          stubActions,
        }),
      ],
      stubs: {
        PrinterModal: {
          template: '<div ref="printerModal"></div>',
        },
      },
    },
    props,
  })
  const storeObj = usePacbioRequestsStore()
  return { wrapperObj, storeObj }
}

const pacbioRequestFactory = PacbioRequestFactory()

describe('PacbioSamples.vue', () => {
  let wrapper

  beforeEach(async () => {
    const plugins = [
      ({ store }) => {
        if (store.$id === 'root') {
          store.api.traction.pacbio.requests.get = vi
            .fn()
            .mockResolvedValue(pacbioRequestFactory.responses.fetch)
        }
      },
    ]
    const { wrapperObj } = mountWithStore({
      plugins,
    })
    await flushPromises()
    wrapper = wrapperObj
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      const headers = wrapper.findAll('th')
      for (const field of wrapper.vm.state.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(5)
    })
  })

  describe('sample metadata modal', () => {
    it('contains sample metadata modal', () => {
      expect(wrapper.findComponent({ ref: 'sampleMetadata' }).exists()).toBeTruthy()
    })
  })

  describe('Details button', () => {
    let button

    it('is present for each sample', () => {
      button = wrapper.find('#details-btn-40')
      expect(button.text()).toEqual('Show Details')
    })
  })

  describe('Printing labels', () => {
    beforeEach(() => {
      wrapper.vm.state.selected = [
        { id: 1, barcode: 'TRAC-1', source_identifier: 'SQSC-1' },
        { id: 2, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
        { id: 3, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
      ]
    })

    describe('#createLabels', () => {
      it('will have the correct number of labels', () => {
        expect(wrapper.vm.createLabels().length).toEqual(3)
      })

      it('will have the correct text for each label', () => {
        const label = wrapper.vm.createLabels()[0]
        expect(label.barcode).toEqual('TRAC-1')
        expect(label.first_line).toEqual('Pacbio - Sample')
        expect(/\d{2}-\w{3}-\d{2}/g.test(label.second_line)).toBeTruthy()
        expect(label.third_line).toEqual('TRAC-1')
        expect(label.fourth_line).toEqual('SQSC-1')
        expect(label.label_name).toEqual('main_label')
      })
    })

    describe('#printLabels', () => {
      beforeEach(() => {
        wrapper.vm.printingStore.createPrintJob = vi.fn().mockImplementation(() => {
          return { success: true, message: 'success' }
        })

        const modal = wrapper.findComponent({ ref: 'printerModal' })
        modal.vm.$emit('selectPrinter', 'printer1')
      })

      it('should create a print job', () => {
        expect(wrapper.vm.printingStore.createPrintJob).toBeCalledWith({
          printerName: 'printer1',
          labels: wrapper.vm.createLabels(),
          copies: 1,
        })
      })
    })
  })
})

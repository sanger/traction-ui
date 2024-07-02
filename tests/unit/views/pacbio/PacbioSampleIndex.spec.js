import PacbioSamples from '@/views/pacbio/PacbioSampleIndex.vue'
import { mount, store, Data, flushPromises, createTestingPinia } from '@support/testHelper.js'
import { beforeEach, describe, expect, it } from 'vitest'

function mountWithStore({ props } = {}) {
  const wrapperObj = mount(PacbioSamples, {
    global: {
      plugins: [createTestingPinia({})],
      stubs: {
        PrinterModal: {
          template: '<div ref="printerModal"></div>',
        },
      },
    },
    store,
    props,
  })
  return { wrapperObj }
}

describe('PacbioSamples.vue', () => {
  let wrapper, samples

  beforeEach(async () => {
    // Remove the included data in the dummy response as its not needed
    const PacbioRequestsRequest = Data.PacbioRequestsRequest
    PacbioRequestsRequest.data.included = []

    // DataFetcher calls requests get on render so we need to mock the call
    const requestGet = vi.spyOn(store.state.api.v1.traction.pacbio.requests, 'get')
    requestGet.mockReturnValue(PacbioRequestsRequest)

    // PacbioLibraryCreate calls tags get on render so we need to mock the call
    const tagGet = vi.spyOn(store.state.api.v1.traction.tags, 'get')
    tagGet.mockReturnValue(Data.TactionTags)

    const { wrapperObj } = mountWithStore()
    wrapper = wrapperObj
    samples = wrapper.vm
    await flushPromises()
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      const headers = wrapper.findAll('th')
      for (const field of samples.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(5)
    })
  })

  // TODO: this is tested throughout the app and it is exactly the same
  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      samples.showAlert('show this message', 'danger')
      expect(Object.values(store.state.traction.messages)).toContainEqual({
        type: 'danger',
        message: 'show this message',
      })
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
      // 40 is one of the request id's from Data.PacbioRequestsRequest
      button = wrapper.find('#details-btn-40')
      expect(button.text()).toEqual('Show Details')
    })
  })

  describe('Printing labels', () => {
    beforeEach(() => {
      samples.selected = [
        { id: 1, barcode: 'TRAC-1', source_identifier: 'SQSC-1' },
        { id: 2, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
        { id: 3, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
      ]
    })

    describe('#createLabels', () => {
      it('will have the correct number of labels', () => {
        expect(samples.createLabels().length).toEqual(3)
      })

      it('will have the correct text for each label', () => {
        const label = samples.createLabels()[0]
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
        samples.printingStore.createPrintJob = vi.fn().mockImplementation(() => {
          return { success: true, message: 'success' }
        })

        const modal = wrapper.findComponent({ ref: 'printerModal' })
        modal.vm.$emit('selectPrinter', 'printer1')
      })

      it('should create a print job', () => {
        expect(samples.printingStore.createPrintJob).toBeCalledWith({
          printerName: 'printer1',
          labels: samples.createLabels(),
          copies: 1,
        })
      })
    })
  })
})

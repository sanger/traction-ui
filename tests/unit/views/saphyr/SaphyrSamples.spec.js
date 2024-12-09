import Samples from '@/views/saphyr/SaphyrSamples'
import { mount, store, createTestingPinia } from '@support/testHelper'
import { handleResponse } from '@/api/v2/ResponseHelper.js'
import SaphyrRequestFactory from '@tests/factories/SaphyrRequestFactory.js'
import SaphyrLibraryFactory from '@tests/factories/SaphyrLibraryFactory.js'
import SaphyrEnzymeFactory from '@tests/factories/SaphyrEnzymeFactory.js'

const saphyrLibraryFactory = SaphyrLibraryFactory()
const saphyrEnzymeFactory = SaphyrEnzymeFactory()

function mountWithStore({ props } = {}) {
  const wrapperObj = mount(Samples, {
    global: {
      plugins: [createTestingPinia({})],
      stubs: {
        PrinterModal: {
          template: '<div ref="printerModal"></div>',
        },
        Modal: true,
        EnzymeModal: true,
      },
    },
    store,
    props,
  })
  return { wrapperObj }
}

describe('Samples.vue', () => {
  let wrapper, samples
  const saphyrRequestFactory = SaphyrRequestFactory()

  beforeEach(() => {
    // We mock the request response, to allow the provider to trigger our
    // behaviour for us. We might be better of mocking the action itself, but
    // that gets surprisingly tricky as the store gets heavily modularised.
    // Before we used to inject the state directly, but that caused issues
    // when the component triggered the set requests action itself.
    vi.spyOn(store.getters['traction/saphyr/requests/requestsRequest'], 'get').mockResolvedValue(
      saphyrRequestFactory.responses.fetch,
    )

    // Here we mock enzymes as they are loaded in the modal
    vi.spyOn(store.getters.api.v2.traction.saphyr.enzymes, 'get').mockResolvedValue(
      saphyrEnzymeFactory.responses.fetch,
    )
    const { wrapperObj } = mountWithStore()
    store.state.requests = saphyrRequestFactory.storeData.requests
    wrapper = wrapperObj
    samples = wrapper.vm
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      const headers = wrapper.findAll('th')
      for (const field of samples.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(10)
    })
  })

  describe('selecting samples', () => {
    beforeEach(() => {})

    it('will create a list of selected requests', () => {
      const firstCell = wrapper.find('tbody').findAll('td')[0]
      firstCell.trigger('click')
      expect(samples.selected.length).toEqual(1)
    })
  })

  describe('#createLibraries', () => {
    let selectedEnzymeId, payload, mockSamples

    beforeEach(() => {
      mockSamples = Object.values(saphyrRequestFactory.storeData.requests)

      selectedEnzymeId = 123
      samples.createLibrariesInTraction = vi.fn()
      samples.showAlert = vi.fn()

      samples.selected = mockSamples[0]
      payload = { samples: samples.selected, enzymeID: selectedEnzymeId }
    })

    it('is successful', async () => {
      samples.createLibrariesInTraction.mockResolvedValue(
        handleResponse(saphyrLibraryFactory.responses.fetch),
      )

      await samples.createLibraries(selectedEnzymeId)

      expect(samples.createLibrariesInTraction).toBeCalledWith(payload)
      expect(samples.showAlert).toBeCalledWith(
        'Libraries successfully created with barcodes: TRAC-11,TRAC-12,TRAC-13,TRAC-14,TRAC-15,TRAC-16,TRAC-17,TRAC-18,TRAC-19,TRAC-20,TRAC-21,TRAC-22,TRAC-23,TRAC-24,TRAC-25,TRAC-26,TRAC-27',
        'success',
      )
    })

    it('shows a error message on failure', async () => {
      const failedResponse = {
        status: 422,
        statusText: 'Unprocessable Entity',
        data: { data: { errors: { it: ['did not work'] } } },
      }
      // TODO: Move this to a fetch response
      const expectedResponse = new Response(failedResponse)

      samples.createLibrariesInTraction.mockReturnValue(expectedResponse)

      await samples.createLibraries(selectedEnzymeId)

      expect(samples.createLibrariesInTraction).toBeCalledWith(payload)
      expect(samples.showAlert).toBeCalledWith('Failed to create library in Traction: ', 'danger')
    })
  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      samples.showAlert('show this message', 'danger')
      expect(Object.values(store.state.traction.messages)).toContainEqual({
        type: 'danger',
        message: 'show this message',
      })
    })
  })

  describe('Printing labels', () => {
    beforeEach(() => {
      samples.selected = [
        { id: 1, barcode: 'TRAC-1' },
        { id: 2, barcode: 'TRAC-2' },
        { id: 3, barcode: 'TRAC-2' },
      ]
    })

    describe('#createLabels', () => {
      it('will have the correct number of labels', () => {
        expect(samples.createLabels().length).toEqual(3)
      })

      it('will have the correct text for each label', () => {
        const label = samples.createLabels()[0]
        expect(label.barcode).toEqual('TRAC-1')
        expect(label.first_line).toEqual('Saphyr - Sample')
        expect(/\d{2}-\w{3}-\d{2}/g.test(label.second_line)).toBeTruthy()
        expect(label.third_line).toEqual('TRAC-1')
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

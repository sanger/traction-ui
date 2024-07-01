import Samples from '@/views/saphyr/SaphyrSamples'
import { mount, store, Data, router, createTestingPinia } from '@support/testHelper'
import Response from '@/api/v1/Response'

/**
 * Helper method for mounting a component with a mock instance of pinia, with the given props.
 * This method also returns the wrapper and the store object for further testing.
 *
 * @param {*} - params to be passed to the createTestingPinia method for creating a mock instance of pinia
 * which includes
 * state - initial state of the store.
 * stubActions - boolean to stub actions or not.
 * plugins - plugins to be used while creating the mock instance of pinia.
 */
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
    router,
    props,
  })
  return { wrapperObj }
}

describe('Samples.vue', () => {
  let wrapper, samples

  beforeEach(() => {
    // We mock the request response, to allow the provider to trigger our
    // behaviour for us. We might be better of mocking the action itself, but
    // that gets surprisingly tricky as the store gets heavily modularised.
    // Before we used to inject the state directly, but that caused issues
    // when the component triggered the set requests action itself.
    vi.spyOn(store.getters['traction/saphyr/requests/requestsRequest'], 'get').mockResolvedValue(
      Data.TractionSaphyrRequests,
    )
    // Here we mock enzymes as they are loaded in the modal
    vi.spyOn(store.getters.api.v1.traction.saphyr.enzymes, 'get').mockResolvedValue({
      data: Data.Enzymes,
    })
    const { wrapperObj } = mountWithStore()
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
      mockSamples = new Response(Data.TractionSaphyrRequests).deserialize.requests

      selectedEnzymeId = 123
      samples.createLibrariesInTraction = vi.fn()
      samples.showAlert = vi.fn()

      samples.selected = mockSamples[0]
      payload = { samples: samples.selected, enzymeID: selectedEnzymeId }
    })

    it('is successful', async () => {
      const expectedResponse = new Response(Data.Libraries)
      samples.createLibrariesInTraction.mockReturnValue(expectedResponse)

      await samples.createLibraries(selectedEnzymeId)

      expect(samples.createLibrariesInTraction).toBeCalledWith(payload)
      expect(samples.showAlert).toBeCalledWith(
        'Libraries successfully created with barcodes: TRAC-1,TRAC-2,TRAC-3,TRAC-4,TRAC-5',
        'success',
      )
    })

    it('shows a error message on failure', async () => {
      const failedResponse = {
        status: 422,
        statusText: 'Unprocessable Entity',
        data: { data: { errors: { it: ['did not work'] } } },
      }
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

  describe('enzymeModal', () => {
    beforeEach(() => {
      wrapper.setData({ sortDesc: false })
      samples.createLibraries = vi.fn()
    })

    it('passes selected enzyme id to function on emit event', () => {
      samples.selected = [{ id: 1 }]
      const modal = wrapper.findComponent({ ref: 'enzymeModal' })
      modal.vm.$emit('selectEnzyme', 2)

      expect(samples.createLibraries).toBeCalledWith(2)
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

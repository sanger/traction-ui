import Samples from '@/views/saphyr/SaphyrSamples'
import { mount, localVue, store, Data, router } from '@support/testHelper'
import * as consts from '@/consts/consts'
import Response from '@/api/Response'

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
    wrapper = mount(Samples, {
      localVue,
      store,
      router,
      stubs: {
        PrinterModal: true,
        Modal: true,
        EnzymeModal: true,
      },
    })

    samples = wrapper.vm
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      let headers = wrapper.findAll('th')
      for (let field of samples.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(6)
    })
  })

  describe('selecting samples', () => {
    beforeEach(() => {
      let firstCell = wrapper.find('[role="cell"]')
      firstCell.trigger('click')
    })

    it('will create a list of selected requests', () => {
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
      let expectedResponse = new Response(Data.Libraries)
      samples.createLibrariesInTraction.mockReturnValue(expectedResponse)

      await samples.createLibraries(selectedEnzymeId)

      expect(samples.createLibrariesInTraction).toBeCalledWith(payload)
      expect(samples.showAlert).toBeCalledWith(
        'Libraries successfully created with barcodes: TRAC-1,TRAC-2,TRAC-3,TRAC-4,TRAC-5',
        'success',
      )
    })

    it('shows a error message on failure', async () => {
      let failedResponse = {
        status: 422,
        statusText: 'Unprocessable Entity',
        data: { data: { errors: { it: ['did not work'] } } },
      }
      let expectedResponse = new Response(failedResponse)

      samples.createLibrariesInTraction.mockReturnValue(expectedResponse)

      await samples.createLibraries(selectedEnzymeId)

      expect(samples.createLibrariesInTraction).toBeCalledWith(payload)
      expect(samples.showAlert).toBeCalledWith(consts.MESSAGE_ERROR_CREATE_LIBRARY_FAILED, 'danger')
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

  describe('printerModal', () => {
    beforeEach(() => {
      wrapper.setData({ sortDesc: false })
      samples.handlePrintLabel = vi.fn()
    })

    it('passes selected printer to function on emit event', () => {
      samples.selected = [{ id: 1 }]
      let modal = wrapper.findComponent({ ref: 'printerModal' })
      modal.vm.$emit('selectPrinter', 'printer1')
      expect(samples.handlePrintLabel).toBeCalledWith('saphyr', 'printer1')
    })
  })

  describe('enzymeModal', () => {
    beforeEach(() => {
      wrapper.setData({ sortDesc: false })
      samples.createLibraries = vi.fn()
    })

    it('passes selected enzyme id to function on emit event', () => {
      samples.selected = [{ id: 1 }]
      let modal = wrapper.findComponent({ ref: 'enzymeModal' })
      modal.vm.$emit('selectEnzyme', 2)

      expect(samples.createLibraries).toBeCalledWith(2)
    })
  })
})

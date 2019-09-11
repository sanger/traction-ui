import Samples from '@/views/saphyr/SaphyrSamples'
import EnzymeModal from '@/components/EnzymeModal'
import PrinterModal from '@/components/PrinterModal'
import { mount, localVue, Vuex, Data } from '../../testHelper'
import Libraries from '@/views/saphyr/SaphyrLibraries'
// import TractionTubesWithLibrariesJson from '../../../data/tubeWithLibrary'
// import TractionSaphyrRequests from '../../../data/tractionSaphyrRequests'
import VueRouter from 'vue-router'
import Alert from '@/components/Alert'
import * as consts from '@/consts/consts'
// import LibrariesJson from '../../../data/libraries'
import Response from '@/api/Response'

describe('Samples.vue', () => {

  let wrapper, samples, router

  beforeEach(() => {
    router = new VueRouter({
      routes: [{ path: '/saphyr/libraries', name: 'SaphyrLibraries', component: Libraries, props: true }]
    })

    let store = new Vuex.Store({
      modules: {
        traction: {
          namespaced: true,
          modules: {
            saphyr: {
              namespaced: true,
                modules: {
                tubes: {
                  namespaced: true,
                  state: {
                    tractionTubes: []
                  }
                }
              }
            }
          }
        }
      }
    })

    wrapper = mount(Samples, { localVue,
      store,
      router,
      stubs: {
        Alert: Alert,
        PrinterModal: true,
        Modal: true,
        EnzymeModal: true
      },
      methods: {
        provider () { return }
      }
    })

    samples = wrapper.vm
  })

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.contains(Alert)).toBe(true)
    })
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      let headers = wrapper.findAll('th')
      for (let field of samples.fields) {
        expect(headers.filter(header => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      let mockSamples = new Response(Data.TractionSaphyrRequests).deserialize.requests
      wrapper.setData({ items: mockSamples })
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(5)
    })
  })

  describe('selecting samples', () => {
    beforeEach(async () => {
      let mockSamples = new Response(Data.TractionSaphyrRequests).deserialize.requests
      wrapper.setData({ items: mockSamples })

      let checkboxes = wrapper.findAll(".selected")
      checkboxes.at(0).trigger('click')
    })

    it('will create a list of selected requests', () => {
      expect(samples.selected.length).toEqual(1)
    })
  })

  describe('#handleLibraryCreate', () => {
     let selectedEnzymeId

     beforeEach(() => {
       selectedEnzymeId = 123
       samples.createLibraries = jest.fn()
       samples.handleTractionTubes = jest.fn()
       samples.showAlert = jest.fn()
     })

     it('successful', async () => {
       samples.createLibraries.mockReturnValue()
       samples.handleTractionTubes.mockReturnValue()

       await samples.handleLibraryCreate(selectedEnzymeId)

       expect(samples.createLibraries).toBeCalled()
       expect(samples.handleTractionTubes).toBeCalled()
       expect(samples.showAlert).not.toBeCalled()
     })

     it('unsuccessful', async () => {
       samples.createLibraries.mockReturnValue()

       samples.handleTractionTubes.mockImplementation(() => {
         throw Error('Raise this error')
       })

       await samples.handleLibraryCreate(selectedEnzymeId)

       expect(samples.createLibraries).toBeCalled()
       expect(samples.handleTractionTubes).toBeCalled()
       expect(samples.showAlert).toBeCalled()
     })
  })

  describe('#createLibraries', () => {
    let selectedEnzymeId, payload, mockSamples

    beforeEach(() => {
      mockSamples = new Response(Data.TractionSaphyrRequests).deserialize.requests

      selectedEnzymeId = 123
      samples.createLibrariesInTraction = jest.fn()

      samples.selected = mockSamples[0]
      payload = {'samples': samples.selected, 'enzymeID': selectedEnzymeId}
    })

    it('calls the correct functions', async () => {
      let expectedResponse = new Response(Data.Libraries)
      samples.createLibrariesInTraction.mockReturnValue(expectedResponse)

      await samples.createLibraries(selectedEnzymeId)

      expect(samples.createLibrariesInTraction).toBeCalledWith(payload)
      expect(samples.barcodes).toEqual(["TRAC-1", "TRAC-2", "TRAC-3", "TRAC-4", "TRAC-5"])
    })

    it('throws an Error when there is an error', async () => {
      let failedResponse = { status: 422, statusText: 'Unprocessable Entity', data: { data: { errors: { it: ['did not work'] }} } }
      let expectedResponse = new Response(failedResponse)

      samples.createLibrariesInTraction.mockReturnValue(expectedResponse)

      await expect(samples.createLibraries(selectedEnzymeId)).rejects.toThrow(
        consts.MESSAGE_ERROR_CREATE_LIBRARY_FAILED + expectedResponse.errors.message)
    })
  })

  describe('#handleTractionTubes', () => {
    let failedResponse, mockLibrariesTubes

    beforeEach(() => {
      failedResponse = { status: 422, statusText: 'Unprocessable Entity', data: { data: { errors: { it: ['did not work'] }} } }

      mockLibrariesTubes =  [
        { id: 1, type: "tubes", barcode: 'TRAC-1', material: {id: 6, type: 'libraries', state: 'pending', sample_name: 'sample_d', enzyme_name: 'Nb.BsrDI', created_at: '03/12/2019 11:49' }},
        { id: 2, type: "tubes", barcode: 'TRAC-2', material: {id: 6, type: 'libraries', state: 'pending', sample_name: 'sample_d', enzyme_name: 'Nb.BsrDI', created_at: '03/12/2019 11:49' }}
      ]

      let store = new Vuex.Store({
        modules: {
          traction: {
            namespaced: true,
            modules: {
              saphyr: {
                namespaced: true,
                  modules: {
                  tubes: {
                    namespaced: true,
                    state: {
                      tractionTubes: mockLibrariesTubes
                    },
                    getters: {
                      tractionTubes: state => state.tractionTubes
                    }
                  }
                }
              }
            }
          }
        }
      })

      wrapper = mount(Samples, { localVue,
        store,
        router,
        stubs: {
          Alert: Alert,
          PrinterModal: true,
          Modal: true,
          EnzymeModal: true
        },
        methods: {
          provider () { return }
        }
      })

      samples = wrapper.vm

      samples.getTractionTubesForBarcodes = jest.fn()
      samples.redirectToLibraries = jest.fn()
    })

    it('successfully for libraries', async () => {
      wrapper.setData({ barcodes: ['TRAC-3'] })

      let expectedResponse = new Response(Data.TubeWithLibrary)
      samples.getTractionTubesForBarcodes.mockReturnValue(expectedResponse)

      await samples.handleTractionTubes()
      expect(samples.redirectToLibraries).toBeCalled()
    })

    it('unsuccessfully', async () => {
      wrapper.setData({ barcodes: ['TRAC-3'] })

      let expectedResponse = new Response(failedResponse)
      samples.getTractionTubesForBarcodes.mockReturnValue(expectedResponse)

      await expect(samples.handleTractionTubes()).rejects.toThrow(
        consts.MESSAGE_ERROR_GET_TRACTION_TUBES)
    })

    it('when there are no barcodes', async () => {
      wrapper.setData({ barcodes: '' })

      await expect(samples.handleTractionTubes()).rejects.toThrow(
        consts.MESSAGE_WARNING_NO_BARCODES)
    })
  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      samples.showAlert('show this message', 'danger')
      expect(wrapper.find(Alert).html()).toMatch('show this message')
    })
  })

  describe('printerModal', () => {
    beforeEach(() => {
      samples.handlePrintLabel = jest.fn()
    })

    it('passes selected printer to function on emit event', () => {
      samples.selected = [{id: 1}]
      let modal = wrapper.find(PrinterModal)
      modal.vm.$emit('selectPrinter', 'printer1')

      expect(samples.handlePrintLabel).toBeCalledWith('printer1')
    })
  })


  describe('enzymeModal', () => {
    beforeEach(() => {
      samples.handleLibraryCreate = jest.fn()
    })

    it('passes selected enzyme id to function on emit event', () => {
      samples.selected = [{id: 1}]
      let modal = wrapper.find(EnzymeModal)
      modal.vm.$emit('selectEnzyme', 2)

      expect(samples.handleLibraryCreate).toBeCalledWith(2)
    })
  })

  // add redirectToLibraries test
  // expect(samples.$route.path).toEqual('/saphyr/libraries')

})

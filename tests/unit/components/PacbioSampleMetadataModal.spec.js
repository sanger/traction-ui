import { mount, localVue, Vuex, Data } from '../testHelper'
import PacbioSampleMetadataModal from '@/components/PacbioSampleMetadataModal'
import Response from '@/api/Response'

describe('PacbioSampleMetadataModal.vue', () => {

  let wrapper, modal, props, mockSamples

  beforeEach(() => {
    mockSamples = new Response(Data.TractionPacbioSamples).deserialize.requests
    props = { id: mockSamples[0].id }
    
    let store = new Vuex.Store({
      modules: {
        traction: {
          namespaced: true,
          modules: {
            pacbio: {
              namespaced: true,
              modules: {
                requests: {
                  namespaced: true,
                  state: {
                    requests: mockSamples
                  },
                  getters: {
                    requests: state => state.requests
                  }
                }
              }
            }
          }
        }
      }
    })

    wrapper = mount(PacbioSampleMetadataModal, {
      localVue,
      store,
      propsData: props,
    })

    modal = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('PacbioSampleMetadataModal')
  })

  it('must have a position prop', () => {
    expect(modal.id).toEqual(props.id)
  })

  it('must have show data', () => {
    expect(modal.show).toEqual(false)
  })

  it('can have mapState', () => {
    expect(modal.libraryType).toEqual(mockSamples[0].library_type)
    expect(modal.estimateOfGBRequired).toBeDefined()
    expect(modal.numberOfSMRTCells).toBeDefined()
    expect(modal.costCode).toBeDefined()
    expect(modal.externalStudyId).toBeDefined()
  })
    
  describe('Edit button', () => {
    let button

    it('is present for each sample', () => {
      button = wrapper.find('#editRun-1')
      expect(button.text()).toEqual('Edit')
    })

    it('on click show is true', () => {
      button = wrapper.find('#editRun-1')
      button.trigger('click')
      expect(modal.show).toEqual(true)
    })
  })

  describe('mutators', () => {
    it('updateLibraryType', () => {
      modal.setLibraryType = jest.fn()
      modal.updateLibraryType('lib type')
      expect(modal.setLibraryType).toBeCalledWith({ requestId: mockSamples[0].id, libraryType: 'lib type' })
    })

    it('updateEstimateOfGBRequired', () => {
      modal.setEstimateOfGBRequired = jest.fn()
      modal.updateEstimateOfGBRequired("100")
      expect(modal.setEstimateOfGBRequired).toBeCalledWith({ requestId: mockSamples[0].id, estimateOfGBRequired: "100" })
    })

    it('updateNumberOfSMRTCells', () => {
      modal.setNumberOfSMRTCells = jest.fn()
      modal.updateNumberOfSMRTCells("1")
      expect(modal.setNumberOfSMRTCells).toBeCalledWith({ requestId: mockSamples[0].id, numberOfSMRTCells: "1" })
    })

    it('updateCostCode', () => {
      modal.setCostCode = jest.fn()
      modal.updateCostCode('ABC123')
      expect(modal.setCostCode).toBeCalledWith({ requestId: mockSamples[0].id, costCode: 'ABC123' })
    })

    it('updateExternalStudyId', () => {
      modal.setExternalStudyId = jest.fn()
      modal.updateExternalStudyId('123')
      expect(modal.setExternalStudyId).toBeCalledWith({ requestId: mockSamples[0].id, externalStudyId: '123' })
    })
  })

  describe('update', () => {
    beforeEach(() => {
      modal.alert = jest.fn()
      modal.hide = jest.fn()
      modal.updateRequest = jest.fn()
    })

    it('successful ', async () => {
      modal.updateRequest.mockReturnValue(true)
      await modal.update()
      expect(modal.alert).toBeCalledWith('Sample updated', 'success')
    })

    it('unsuccessful ', async () => {
      modal.updateRequest.mockImplementation(() => {
        throw Error('Raise this error')
      })
      await modal.update()
      expect(modal.alert).toBeCalledWith('Failed to update sample. Error: Raise this error', 'danger')
    })

  })

  describe('alert', () => {
    it('emits an event with the message', () => {
      modal.alert('emit this message', 'success')
      expect(wrapper.emitted().alert).toBeTruthy()
      expect(wrapper.emitted().alert[0][0]).toEqual('emit this message')
      expect(wrapper.emitted().alert[0][1]).toEqual('success')
    })
  })

  it('#generateId', () => {
    expect(modal.generateId('edit', 1)).toEqual('edit-1')
  })

})

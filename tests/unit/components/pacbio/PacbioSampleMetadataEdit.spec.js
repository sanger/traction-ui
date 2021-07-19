import { mount, localVue, Data, store } from '../../testHelper'
import PacbioSampleMetadataEdit from '@/components/pacbio/PacbioSampleMetadataEdit'
import Response from '@/api/Response'

describe('PacbioSampleMetadataEdit.vue', () => {
  let wrapper, modal, props, mockSamples

  beforeEach(() => {
    mockSamples = new Response(Data.TractionPacbioSamples).deserialize.requests
    props = { req: mockSamples[0] }

    store.commit('traction/pacbio/requests/setRequests', mockSamples)

    wrapper = mount(PacbioSampleMetadataEdit, {
      localVue,
      store,
      propsData: props,
    })

    modal = wrapper.vm
  })

  it('will have a modal', () => {
    expect(wrapper.find('#editSampleModal')).toBeDefined()
  })

  describe('form group', () => {
    it('will have a form', () => {
      expect(wrapper.find('#sampleMetaDataForm')).toBeDefined()
    })

    it('will have a libraryType input field', () => {
      expect(wrapper.find('#libraryType')).toBeDefined()
    })

    it('will have a estimateOfGBRequired input field', () => {
      expect(wrapper.find('#estimateOfGBRequired')).toBeDefined()
    })

    it('will have a numberOfSMRTCells input field', () => {
      expect(wrapper.find('#numberOfSMRTCells')).toBeDefined()
    })

    it('will have a costCode input field', () => {
      expect(wrapper.find('#costCode')).toBeDefined()
    })

    it('will have a qcStatus selection field', () => {
      expect(wrapper.find('#qcStatus')).toBeDefined()
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
      expect(modal.hide).toBeCalled()
    })

    it('unsuccessful ', async () => {
      modal.updateRequest.mockImplementation(() => {
        throw Error('Raise this error')
      })
      await modal.update()
      expect(modal.alert).toBeCalledWith(
        'Failed to update sample. Error: Raise this error',
        'danger',
      )
      expect(modal.hide).toBeCalled()
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

  describe('Edit button', () => {
    let button

    it('is present for each sample', () => {
      button = wrapper.find('#editSample-1')
      expect(button.text()).toEqual('Edit')
    })
  })

  it('#generateId', () => {
    expect(modal.generateId('edit', 1)).toEqual('edit-1')
  })
})

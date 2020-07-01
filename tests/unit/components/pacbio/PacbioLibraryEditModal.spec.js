import { mount, localVue, store, Data } from '../../testHelper'
import PacbioLibraryEditModal from '@/components/pacbio/PacbioLibraryEditModal'
import Response from '@/api/Response'

describe('PacbioLibraryEditModal.vue', () => {

  let wrapper, modal, props, mockLibrary

  beforeEach(() => {
    mockLibrary = new Response(Data.TractionPacbioLibrary).deserialize.libraries[0],
    props = { lib: mockLibrary }
  
    wrapper = mount(PacbioLibraryEditModal, {
      localVue,
      store,
      propsData: props
    }),

    modal = wrapper.vm
  }),

  it('will have a modal', () => {
    expect(wrapper.find('#editLibraryModal')).toBeDefined()
  })

  it('will have a form', () => {
    expect(wrapper.find('#libraryMetaDataForm')).toBeDefined()
  })

  it('must have a library prop', () => {
    expect(props.lib).toBeDefined()
  })
 
  describe('update', () => {
    beforeEach(() => {
      modal.alert = jest.fn()
      modal.hide = jest.fn()
      modal.updateLibrary = jest.fn()
    })

    it('successful ', async () => {
      modal.updateLibrary.mockReturnValue(true)
      await modal.update()
      expect(modal.alert).toBeCalledWith('Library updated', 'success')
      expect(modal.hide).toBeCalled()
    })

    it('unsuccessful ', async () => {
      modal.updateLibrary.mockImplementation(() => {
        throw Error('Raise this error')
      })
      await modal.update()
      expect(modal.alert).toBeCalledWith('Failed to update library. Error: Raise this error', 'danger')
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

})
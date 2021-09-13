import Response from '@/api/Response'
import PacbioLibraryEdit from '@/components/pacbio/PacbioLibraryEdit'
import { Data, localVue, mount, store } from 'testHelper'

describe('PacbioLibraryEdit.vue', () => {
  let wrapper, modal, props, mockLibrary

  beforeEach(() => {
    // TODO: The TractionPacbioLibrary needs to be updated to reflect the current structure
    mockLibrary = new Response(Data.TractionPacbioLibrary).deserialize.libraries[0]
    props = { lib: mockLibrary }
    wrapper = mount(PacbioLibraryEdit, {
      localVue,
      store,
      propsData: props,
    })
    modal = wrapper.vm
  })

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
      modal.updateLibrary.mockReturnValue({ success: true, errors: [] })
      await modal.update()
      expect(modal.alert).toBeCalledWith('Library updated', 'success')
      expect(modal.hide).toBeCalled()
    })

    it('unsuccessful ', async () => {
      modal.updateLibrary.mockReturnValue({ success: false, errors: ['Raise this error'] })
      await modal.update()
      expect(modal.alert).toBeCalledWith('Failed to update library. Raise this error', 'danger')
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

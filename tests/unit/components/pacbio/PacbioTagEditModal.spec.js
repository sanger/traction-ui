import { mount, localVue, store } from '../../testHelper'
import PacbioTagEditModal from '@/components/pacbio/PacbioTagEditModal'

describe('PacbioTagEditModal.vue', () => {

  let wrapper, modal, props, mockRequestLibrary

  beforeEach(() => {
    mockRequestLibrary= {
        "id": "4",
        "sample_id": "5",
        "sample_name": "sample_name",
        "tag_group_id": "bc1001_BAK8A_OA",
        "tag_id": 1,
        "tag_oligo": "CACATATCAGAGTGCGT",
        "tag_set_name": "Sequel_16_barcodes_v3",
        "type": "request_libraries",
    },

    props = { request_library: mockRequestLibrary },
  
    wrapper = mount(PacbioTagEditModal, {
      localVue,
      store,
      propsData: props
    }),

    modal = wrapper.vm
  }),

  it('will have a modal', () => {
    expect(wrapper.find('#editTagModal')).toBeDefined()
  })

  it('will have a form', () => {
    expect(wrapper.find('#editTagForm')).toBeDefined()
  })

  it('must have a request_library prop', () => {
    expect(props.request_library).toBeDefined()
  })
 
  describe('update', () => {
    beforeEach(() => {
      modal.alert = jest.fn()
      modal.hide = jest.fn()
      modal.updateTag= jest.fn()
    })

    it('successful ', async () => {
      let response = {
        status: 200,
        successful: true
      }

      modal.updateTag.mockReturnValue(response)
      await modal.update()
      expect(modal.alert).toBeCalledWith('Tag updated', 'success')
      expect(modal.hide).toBeCalled()
    })

    it('unsuccessful ', async () => {
      let response = {
        status: 422,
        successful: false
      }

      modal.updateTag.mockReturnValue(response)
      await modal.update()
      expect(modal.alert).toBeCalledWith('Failed to update Tag', 'danger')
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
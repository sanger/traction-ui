import { mount, localVue, store } from '../../testHelper'
import PacbioPlateInfoModal from '@/components/pacbio/PacbioPlateInfoModal'

describe('PacbioTagEdit.vue', () => {
  let wrapper, modal, props, mockPlate

  beforeEach(() => {
    ;(mockPlate = {
      id: '4',
      barcode: 'DN1',
    }),
      (props = { plate: mockPlate })
    wrapper = mount(PacbioPlateInfoModal, {
      localVue,
      store,
      propsData: props,
    })
    modal = wrapper.vm
  })

  it('will have a modal', () => {
    expect(wrapper.find('#infoPlateModal')).toBeDefined()
  })

  it('must have a plate prop', () => {
    expect(props.plate).toBeDefined()
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

import { mount, localVue, store, Data } from 'testHelper'
import PacbioLabwareFind from '@/components/pacbio/PacbioLabwareFind'
import Response from '@/api/Response'

describe('PacbioLabwareFind', () => {
  let wrapper, mockPlates

  beforeEach(() => {
    mockPlates = new Response(Data.PacbioPlates)._body.data
    store.commit('traction/pacbio/poolCreate/populatePlates', mockPlates)

    wrapper = mount(PacbioLabwareFind, {
      localVue,
      store,
    })
  })

  it('will have a form', () => {
    expect(wrapper.find('.labware-list')).toBeDefined()
  })

  it('contains the correct data', () => {
    expect(wrapper.find('.list-group').findAll('.list-group-item').length).toEqual(2)
  })

  it('filters the list when the input is entered', () => {
    wrapper.vm.enteredLabware = 'DN1'
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.list-group').findAll('.list-group-item').length).toEqual(1)
    })
  })

  describe('Handle submit', () => {
    it('handleSubmit calls mutation when enteredLabware is an existing plate barcode', () => {
      wrapper.vm.toggleSelected = jest.fn()
      wrapper.setData({ enteredLabware: 'DN1' })
      wrapper.vm.handleSubmit()
      expect(wrapper.vm.toggleSelected).toBeCalled()
    })

    it('handleSubmit calls mutation when enteredLabware is an existing plate barcode', () => {
      wrapper.vm.setSelected = jest.fn()
      wrapper.vm.showAlert = jest.fn()
      wrapper.setData({ enteredLabware: 'Not a plate Barcode' })
      wrapper.vm.handleSubmit()
      expect(wrapper.vm.setSelected).not.toBeCalled()
      expect(wrapper.vm.showAlert).toBeCalledWith(
        'Unable to find labware with the barcode: Not a plate Barcode',
        'danger',
      )
    })
  })
})

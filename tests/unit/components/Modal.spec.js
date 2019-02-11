import { mount, localVue } from '../testHelper'
import Modal from '@/components/Modal'

describe('Modal.vue', () => {

  let wrapper, alert, modal

  beforeEach(() => {
    wrapper = mount(Modal, {
      localVue,
      propsData: {
        disabled: true
      }
    })
    modal = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Modal')
  })

  it('will have an button component', () => {
    expect(wrapper.contains('.btn')).toBe(true)
  })

  it('will have an modal component', () => {
    expect(wrapper.contains('.modal')).toBe(true)
  })

  it('has a selectedEnzymeId', () => {
    wrapper.setData({ selectedEnzymeId: 1 })
    expect(wrapper.vm.selectedEnzymeId).toBe(1)
  })

  it('has a list of options', () => {
    wrapper.setData({ options: [
      { value: 1, text: 'option1' },
      { value: 2, text: 'option2' }]
    })
    expect(modal.options.length).toBe(2)
  })

  it('has a disabled property', () => {
    expect(wrapper.props().disabled).toBe(true)
  })

  it('has options', () => {
    let options = [
      { value: null, text: 'Please select an option' },
      { value: 1, text: 'Nb.BsmI' },
      { value: 2, text: 'Nt.BspQI' },
      { value: 3, text: 'Nb.BssSI' },
      { value: 4, text: 'DLE-1' }
    ]
    expect(modal.options).toEqual(options)
    expect(wrapper.find('select').findAll('option').length).toEqual(options.length)
  })

  it('#handleOk without selectedEnzymeId', () => {
    let evt = { preventDefault: () => { return {} }}
    window.alert = jest.fn()
    wrapper.vm.handleOk(evt)
    expect(window.alert).toBeCalledWith('Please select an enzyme')
  })

  it('#handleOk with selectedEnzymeId', () => {
    wrapper.setData({ selectedEnzymeId: 1 })
    let evt = { preventDefault: () => { return {} }}
    wrapper.vm.handleOk(evt)
    expect(wrapper.emitted().selectEnzyme).toBeTruthy()
  })

  it('#handleSubmit', () => {
    wrapper.setData({ selectedEnzymeId: 1 })
    wrapper.vm.handleSubmit()
    expect(wrapper.emitted().selectEnzyme).toBeTruthy()
  })

})

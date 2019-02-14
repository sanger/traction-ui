import { mount, localVue } from '../testHelper'
import Modal from '@/components/Modal'
import flushPromises from 'flush-promises'

describe('Modal.vue', () => {

  let wrapper, modal

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

  it('has a disabled property', () => {
    expect(wrapper.props().disabled).toBe(true)
  })

  it('has options', () => {
    let enzymeOptions = { enzymeOptions: [{ value: null, text: 'Please select an option' },
      { value: 1, text: 'enz1' },
      { value: 2, text: 'enz2' }]
    }

    wrapper.setData(enzymeOptions)
    expect(modal.enzymeOptions).toEqual(enzymeOptions.enzymeOptions)
    expect(wrapper.find('select').findAll('option').length).toEqual(enzymeOptions.enzymeOptions.length)
  })

  describe('#getEnzymeOptions', () => {
    let response

    beforeEach(() => {
      modal.tractionApiEnzyme.get = jest.fn()
    })

    it('success', async () => {
      let enzymesResponse = [{ name: 'enz1' }, { name: 'enz2' }]
      response = { body: enzymesResponse }

      modal.tractionApiEnzyme.data = response
      modal.tractionApiEnzyme.get.mockReturnValue(response)

      modal.getEnzymeOptions()
      await flushPromises()

      expect(modal.tractionApiEnzyme.get).toBeCalled()

      let enzymeOptions = [
        { value: null, text: 'Please select an option' },
        { value: 1, text: 'enz1' },
        { value: 2, text: 'enz2' }
      ]
      expect(modal.enzymeOptions).toEqual(enzymeOptions)
    })

    it('failure', async () => {
      response = {message: 'Something went wrong'}
      modal.tractionApiEnzyme.errors = response
      modal.tractionApiEnzyme.get.mockReturnValue(response)

      let fn = modal.getEnzymeOptions()
      await expect(fn).rejects.toBe("Something went wrong")

      expect(modal.tractionApiEnzyme.get).toBeCalled()
      expect(modal.message).toEqual("Something went wrong")
    })
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

import { mount, localVue, store } from '../testHelper'
import Modal from '@/components/Modal'
import flushPromises from 'flush-promises'
import EnzymesJson from '../../data/enzymes'
import Response from '@/api/Response'

describe('Modal.vue', () => {

  let wrapper, modal

  beforeEach(() => {
    wrapper = mount(Modal, {
      localVue,
      store,
      propsData: {
        disabled: true
      },
      methods: {
        provider () { return }
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

  describe('data', () => {
    it('has a selectedEnzymeId', () => {
      wrapper.setData({ selectedEnzymeId: 1 })
      expect(wrapper.vm.selectedEnzymeId).toBe(1)
    })

    it('has enzyme options', () => {
      let enzymeOptions = { enzymeOptions: [{ value: null, text: 'Please select an option' },
        { value: 1, text: 'enz1' },
        { value: 2, text: 'enz2' }]
      }

      wrapper.setData(enzymeOptions)
      expect(modal.enzymeOptions).toEqual(enzymeOptions.enzymeOptions)
      expect(wrapper.find('select').findAll('option').length).toEqual(enzymeOptions.enzymeOptions.length)
    })
  })

  describe('props', () => {
    it('has a disabled property', () => {
      expect(wrapper.props().disabled).toBe(true)
    })
  })

  describe('#handleOk', () => {
    it('without selectedEnzymeId', () => {
      let evt = { preventDefault: () => { return {} }}
      window.alert = jest.fn()
      wrapper.vm.handleOk(evt)
      expect(window.alert).toBeCalledWith('Please select an enzyme')
    })

    it('with selectedEnzymeId', () => {
      wrapper.setData({ selectedEnzymeId: 1 })
      let evt = { preventDefault: () => { return {} }}
      wrapper.vm.handleOk(evt)
      expect(wrapper.emitted().selectEnzyme).toBeTruthy()
    })
  })

  describe('#handleSubmit', () => {
    it('#handleSubmit', () => {
      wrapper.setData({ selectedEnzymeId: 1 })
      wrapper.vm.handleSubmit()
      expect(wrapper.emitted().selectEnzyme).toBeTruthy()
    })
  })

  describe('#getEnzymeOptions', () => {

    beforeEach(() => {
      modal.enzymeRequest.execute = jest.fn()
    })

    it('success', async () => {
      modal.enzymeRequest.execute.mockResolvedValue(EnzymesJson)

      await modal.getEnzymeOptions()

      let enzymes = new Response(EnzymesJson).deserialize.enzymes
      let enzymeOptions = enzymes.map((enzyme, index) => Object.assign({ value: index+1, text: enzyme.name }))
      enzymeOptions.unshift({ value: null, text: "Please select an option" })

      expect(modal.enzymeOptions).toEqual(enzymeOptions)
    })

    it('failure', async () => {
      let mockResponse = {
        data: {
          errors: {
            name: ['name error message 1']
          }
        },
        status: 422,
        statusText: "Unprocessible entity"
      }

      modal.enzymeRequest.execute.mockReturnValue(mockResponse)

      await modal.getEnzymeOptions()
      await flushPromises()

      expect(modal.message).toEqual("name name error message 1")
    })
  })

  describe('#enzymeRequest', () => {
    it('will have a request', () => {
      expect(modal.enzymeRequest).toBeDefined()
    })
  })
})

import { mount, localVue, store } from '../../testHelper'
import EnzymeModal from '@/components/saphyr/SaphyrEnzymeModal'
import flushPromises from 'flush-promises'
import EnzymesJson from '../../../data/enzymes'
import Response from '@/api/Response'

describe('SaphyrEnzymeModal.vue', () => {

  let wrapper, enzymeModal

  beforeEach(() => {
    wrapper = mount(EnzymeModal, {
      localVue,
      store,
      propsData: {
        disabled: true,
        isStatic: true
      },
      methods: {
        provider () { return }
      }
    })
    enzymeModal = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('SaphyrEnzymeModal')
  })

  it('will have an button component', () => {
    expect(wrapper.contains('#createLibrariesWithEnzymeButton')).toBe(true)
  })

  it('will have an modal component', () => {
    expect(wrapper.contains('#enzymeModal')).toBe(true)
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
      expect(enzymeModal.enzymeOptions).toEqual(enzymeOptions.enzymeOptions)
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
      expect(wrapper.emitted().selectEnzyme[0]).toEqual([1])
    })
  })

  describe('#handleSubmit', () => {
    it('#handleSubmit', () => {
      wrapper.setData({ selectedEnzymeId: 1 })
      wrapper.vm.handleSubmit()
      expect(wrapper.emitted().selectEnzyme).toBeTruthy()
      expect(wrapper.emitted().selectEnzyme[0]).toEqual([1])
    })
  })

  describe('#getEnzymeOptions', () => {

    beforeEach(() => {
      enzymeModal.enzymeRequest.execute = jest.fn()
    })

    it('success', async () => {
      enzymeModal.enzymeRequest.execute.mockResolvedValue(EnzymesJson)

      await enzymeModal.getEnzymeOptions()

      let enzymes = new Response(EnzymesJson).deserialize.enzymes
      let enzymeOptions = enzymes.map((enzyme, index) => Object.assign({ value: index+1, text: enzyme.name }))
      enzymeOptions.unshift({ value: null, text: "Please select an option" })

      expect(enzymeModal.enzymeOptions).toEqual(enzymeOptions)
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

      enzymeModal.enzymeRequest.execute.mockReturnValue(mockResponse)

      await enzymeModal.getEnzymeOptions()
      await flushPromises()

      expect(enzymeModal.message).toEqual("name name error message 1")
    })
  })

  describe('#enzymeRequest', () => {
    it('will have a request', () => {
      expect(enzymeModal.enzymeRequest).toBeDefined()
    })
  })
})

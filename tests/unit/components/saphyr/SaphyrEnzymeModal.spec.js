import EnzymeModal from '@/components/saphyr/SaphyrEnzymeModal.vue'
import { mount, store, flushPromises, failedResponse } from '@support/testHelper.js'
import SaphyEnzymeFactory from '@tests/factories/SaphyrEnzymeFactory.js'

const saphyrEnzymeFactory = SaphyEnzymeFactory()

describe('SaphyrEnzymeModal.vue', () => {
  let wrapper, enzymeModal

  beforeEach(() => {
    // create the mock of the method before mounting it for testing
    vi.spyOn(EnzymeModal.methods, 'provider').mockImplementation(() => {})

    wrapper = mount(EnzymeModal, {
      store,
      props: {
        disabled: true,
        isStatic: true,
      },
    })
    enzymeModal = wrapper.vm
    enzymeModal.showModal = true
  })

  it('will have an button component', () => {
    expect(wrapper.find('#createLibrariesWithEnzymeButton').exists()).toBeTruthy()
  })

  it('will have an modal component', () => {
    expect(wrapper.find('.modal')).toBeTruthy()
  })

  describe('data', () => {
    it('has a selectedEnzymeId', () => {
      wrapper.setData({ selectedEnzymeId: 1 })
      expect(wrapper.vm.selectedEnzymeId).toBe(1)
    })

    it('has enzyme options', async () => {
      const enzymeOptions = {
        enzymeOptions: [
          { value: null, text: 'Please select an option' },
          { value: 1, text: 'enz1' },
          { value: 2, text: 'enz2' },
        ],
      }

      wrapper.setData(enzymeOptions)
      expect(enzymeModal.enzymeOptions).toEqual(enzymeOptions.enzymeOptions)
      await flushPromises()
      expect(wrapper.find('select').findAll('option').length).toEqual(
        enzymeOptions.enzymeOptions.length,
      )
    })
  })

  describe('props', () => {
    it('has a disabled property', () => {
      expect(wrapper.props().disabled).toBe(true)
    })
  })

  describe('#handleOk', () => {
    it('without selectedEnzymeId', () => {
      const evt = {
        preventDefault: () => {
          return {}
        },
      }
      window.alert = vi.fn()
      wrapper.vm.handleOk(evt)
      expect(window.alert).toBeCalledWith('Please select an enzyme')
    })

    it('with selectedEnzymeId', () => {
      wrapper.setData({ selectedEnzymeId: 1 })
      const evt = {
        preventDefault: () => {
          return {}
        },
      }
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
      enzymeModal.enzymeRequest.get = vi.fn()
    })

    it('success', async () => {
      enzymeModal.enzymeRequest.get.mockResolvedValue(saphyrEnzymeFactory.responses.fetch)

      await enzymeModal.getEnzymeOptions()

      expect(enzymeModal.enzymeOptions.length).toEqual(saphyrEnzymeFactory.content.data.length + 1)
    })

    it('failure', async () => {
      const mockResponse = failedResponse(422)

      enzymeModal.enzymeRequest.get.mockResolvedValue(mockResponse)
      await enzymeModal.getEnzymeOptions()
      await flushPromises()

      expect(enzymeModal.message).toEqual('error1 There was an error.')
    })
  })

  describe('#enzymeRequest', () => {
    it('will have a request', () => {
      expect(enzymeModal.enzymeRequest).toBeDefined()
    })
  })
})

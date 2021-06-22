import { mount, localVue, store, Data } from '../../testHelper'
import PacbioLibraryCreate from '@/components/pacbio/PacbioLibraryCreate'
import Response from '@/api/Response'
import * as consts from '@/consts/consts'

describe('PacbioLibraryCreate.vue', () => {
  let wrapper, modal, props

  beforeEach(() => {
    props = {
      disabled: true,
      isStatic: true,
      selectedSample: { id: 1 },
    }

    wrapper = mount(PacbioLibraryCreate, {
      localVue,
      store,
      propsData: props,
    })
    modal = wrapper.vm
  })

  it('will have an button component', () => {
    expect(wrapper.find('#pacbioLibraryCreate').element).toBeTruthy()
  })

  it('will have an modal component', () => {
    expect(wrapper.find('#pacbioLibraryModal').element).toBeTruthy()
  })

  it('will have an form component', () => {
    expect(wrapper.find('#libraryCreateModal').element).toBeTruthy()
  })

  it('must have a disabled prop', () => {
    expect(modal.disabled).toEqual(props.disabled)
  })

  it('must have a isStatic prop', () => {
    expect(modal.isStatic).toEqual(props.isStatic)
  })

  it('must have a selectedSample prop', () => {
    expect(modal.selectedSample).toEqual(props.selectedSample)
  })

  it('must have tagOptions data', () => {
    expect(modal.tagOptions).toEqual([])
  })

  describe('#createLibrary', () => {
    let payload

    beforeEach(() => {
      modal.createLibraryInTraction = jest.fn()
      modal.showAlert = jest.fn()
      payload = { tag: { group_id: 1 }, sample: { id: 1 } }
    })

    it('is successful', async () => {
      wrapper.setData({ library: { tag: { group_id: 1 }, sample: { id: 1 } } })
      let expectedResponse = new Response(Data.Libraries)
      modal.createLibraryInTraction.mockReturnValue(expectedResponse)

      await modal.createLibrary()

      expect(modal.createLibraryInTraction).toBeCalledWith(payload)
      expect(wrapper.emitted().alert).toBeTruthy()
    })

    it('shows a error message on when there isnt a tag', async () => {
      await modal.createLibrary()

      expect(modal.createLibraryInTraction).not.toBeCalledWith(payload)
      expect(modal.showAlert).toBeCalledWith(
        consts.MESSAGE_ERROR_CREATE_LIBRARY_FAILED + 'Please select a tag',
        'danger',
      )
    })

    it('shows a error message on failure', async () => {
      wrapper.setData({ library: { tag: { group_id: 1 }, sample: { id: 1 } } })

      let failedResponse = {
        status: 422,
        statusText: 'Unprocessable Entity',
        data: { errors: { it: ['did not work'] } },
      }
      let expectedResponse = new Response(failedResponse)

      modal.createLibraryInTraction.mockReturnValue(expectedResponse)

      await modal.createLibrary()

      expect(modal.createLibraryInTraction).toBeCalledWith(payload)
      expect(modal.showAlert).toBeCalledWith(
        consts.MESSAGE_ERROR_CREATE_LIBRARY_FAILED + 'it did not work',
        'danger',
      )
    })
  })
})

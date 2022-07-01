import { mount, localVue, store } from '@support/testHelper'
import PacbioLibraryCreate from '@/components/pacbio/PacbioLibraryCreate'
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
    expect(modal.tagOptions).toEqual([{ value: '', text: 'No tag' }])
  })

  describe('#createLibrary', () => {
    let payload

    beforeEach(() => {
      modal.createLibraryInTraction = vi.fn()
      modal.showAlert = vi.fn()
      payload = { tag: { group_id: 1 }, sample: { id: 1 } }
    })

    it('is successful', async () => {
      wrapper.setData({ library: payload })
      let expectedResponse = { success: true, barcode: 'TRAC-1', errors: [] }
      modal.createLibraryInTraction.mockReturnValue(expectedResponse)

      await modal.createLibrary()

      expect(modal.createLibraryInTraction).toBeCalledWith(payload)
      expect(wrapper.emitted().alert).toBeTruthy()
    })

    it('does not error when there is no tag', async () => {
      const payloadNoTag = { tag: { group_id: '' }, sample: { id: 1 } }
      wrapper.setData({ library: payloadNoTag })
      let expectedResponse = { success: true, barcode: 'TRAC-1', errors: [] }
      modal.createLibraryInTraction.mockReturnValue(expectedResponse)

      await modal.createLibrary()

      expect(modal.createLibraryInTraction).toBeCalledWith(payloadNoTag)
      expect(wrapper.emitted().alert).toBeTruthy()
    })

    it('shows a error message on failure', async () => {
      wrapper.setData({ library: { tag: { group_id: 1 }, sample: { id: 1 } } })

      let expectedResponse = { success: false, barcode: '', errors: ['it did not work'] }
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

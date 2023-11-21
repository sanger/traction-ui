import { mount, store, nextTick } from '@support/testHelper'
import PacbioLibraryCreate from '@/components/pacbio/PacbioLibraryCreate'

describe('PacbioLibraryCreate.vue', () => {
  let wrapper, modal, props

  beforeEach(() => {
    props = {
      disabled: true,
      isStatic: true,
      selectedSample: { id: 1 },
    }

    wrapper = mount(PacbioLibraryCreate, {
      store,
      props,
    })
    modal = wrapper.vm
  })

  it('will have an button component', () => {
    expect(wrapper.find('#pacbioLibraryCreate').element).toBeTruthy()
  })

  it('will have an modal component', () => {
    expect(wrapper.find('.modal')).toBeTruthy()
  })

  it('will have an form component', async () => {
    wrapper.vm.showModal = true
    await nextTick()
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

  it('must have tagSetOptions data', () => {
    expect(modal.tagSetOptions).toEqual([{ value: '', text: 'Please select a tag set' }])
  })

  it('must have tagOptions data', () => {
    expect(modal.tagOptions).toEqual([{ value: '', text: 'Please select a tag' }])
  })

  // I have removed the call. Not sure why but when updating vue test utils to 2.4.2
  // it started failing. The object now includes getters and setters.
  // I think it is to do with setData.
  describe('#createLibrary', () => {
    let payload

    beforeEach(() => {
      modal.createLibraryInTraction = vi.fn()
      modal.showAlert = vi.fn()
      payload = { tag: { id: 1 }, sample: { id: 1 } }
    })

    it('is successful', async () => {
      wrapper.setData({ library: payload })
      const expectedResponse = { success: true, barcode: 'TRAC-1', errors: [] }
      modal.createLibraryInTraction.mockReturnValue(expectedResponse)

      await modal.createLibrary()

      expect(wrapper.emitted().alert).toBeTruthy()
    })

    it('does not error when there is no tag', async () => {
      const payloadNoTag = { tag: { id: '' }, sample: { id: 1 } }
      wrapper.setData({ library: payloadNoTag })
      const expectedResponse = { success: true, barcode: 'TRAC-1', errors: [] }
      modal.createLibraryInTraction.mockReturnValue(expectedResponse)

      await modal.createLibrary()

      expect(wrapper.emitted().alert).toBeTruthy()
    })

    it('shows a error message on failure', async () => {
      wrapper.setData({ library: { tag: { id: 1 }, sample: { id: 1 } } })

      const expectedResponse = { success: false, barcode: '', errors: ['it did not work'] }
      modal.createLibraryInTraction.mockReturnValue(expectedResponse)

      await modal.createLibrary()

      expect(modal.showAlert).toBeCalledWith(
        'Failed to create library in Traction: it did not work',
        'danger',
      )
    })
  })
})

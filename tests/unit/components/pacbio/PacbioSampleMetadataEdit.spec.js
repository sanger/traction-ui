import { mountWithStore, flushPromises } from '@support/testHelper.js'
import PacbioSampleMetadataEdit from '@/components/pacbio/PacbioSampleMetadataEdit.vue'
import { usePacbioRequestsStore } from '@/stores/pacbioRequests.js'
import PacbioRequestFactory from '@tests/factories/PacbioRequestFactory.js'

const pacbioRequestFactory = PacbioRequestFactory({ includeRelationships: false })

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

describe('PacbioSampleMetadataEdit.vue', () => {
  let wrapper, props, mockSamples, store

  beforeEach(async () => {
    mockSamples = pacbioRequestFactory.content.data
    props = { req: mockSamples[0] }
    ;({ wrapper, store } = mountWithStore(PacbioSampleMetadataEdit, {
      props,
      createStore: () => usePacbioRequestsStore(),
    }))
    await flushPromises()
  })

  describe('update', () => {
    beforeEach(() => {
      store.updateRequest = vi.fn()
    })

    it('successful ', async () => {
      store.updateRequest.mockResolvedValue({ success: true, errors: [] })
      await wrapper.vm.update()
      expect(mockShowAlert).toBeCalledWith('Sample updated', 'success')
    })

    it('unsuccessful ', async () => {
      store.updateRequest.mockReturnValue({ success: false, errors: ['Error: Raise this error'] })
      await wrapper.vm.update()
      expect(mockShowAlert).toBeCalledWith(
        'Failed to update sample. Error: Raise this error',
        'danger',
      )
    })
  })

  it('#generateId', () => {
    expect(wrapper.vm.generateId('edit', 1)).toEqual('edit-1')
  })
})

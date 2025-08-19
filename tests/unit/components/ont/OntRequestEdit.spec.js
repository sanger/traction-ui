import { mountWithStore } from '@support/testHelper.js'
import OntRequestEdit from '@/components/ont/OntRequestEdit.vue'
import { useOntRequestsStore } from '@/stores/ontRequests.js'
import OntRequestFactory from '@tests/factories/OntRequestFactory.js'

const ontRequestFactory = OntRequestFactory()

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

const mountComponent = (props = {}) => {
  const { wrapper, store } = mountWithStore(OntRequestEdit, {
    initialState: {
      ontRequests: {
        resources: {
          requests: ontRequestFactory.storeData.resources,
        },
      },
    },
    props,
    createStore: () => useOntRequestsStore(),
  })
  return { wrapper, store }
}

describe('OntRequestEdit', () => {
  describe('with a valid existing request', () => {
    let wrapper, store, request

    beforeEach(() => {
      request = Object.values(ontRequestFactory.storeData.resources)[0]
      ;({ wrapper, store } = mountComponent({ id: request.id }))
    })

    it('shows the source identifier', () => {
      expect(wrapper.find('[data-attribute="source-identifier"]').text()).toEqual(
        request.source_identifier,
      )
    })

    it('shows the sample name', () => {
      expect(wrapper.find('[data-attribute="sample-name"]').text()).toEqual(request.sample_name)
    })

    it('shows the library type', () => {
      expect(wrapper.find('[data-attribute="library-type"]').text()).toEqual(request.library_type)
    })

    it('shows the data type', () => {
      expect(wrapper.find('[data-attribute="data-type"]').text()).toEqual(request.data_type)
    })

    it('shows the number of flowcells', () => {
      expect(wrapper.find('[data-attribute="number-of-flowcells"]').text()).toEqual(
        request.number_of_flowcells.toString(),
      )
    })

    it('allows the cost code to be edited', () => {
      const input = wrapper.find('[data-attribute="cost-code"]')
      input.setValue('new-cost-code')
      expect(wrapper.vm.request.cost_code).toEqual('new-cost-code')
    })

    it('cancel button emits "editCancelled"', async () => {
      const button = wrapper.find('[data-action="cancel-edit"]')
      await button.trigger('click')
      expect(wrapper.emitted().editCompleted).toBeTruthy()
    })

    it('updates the request successfully', async () => {
      store.updateRequest = vi.fn(() => Promise.resolve({ success: true }))
      const input = wrapper.find('[data-attribute="cost-code"]')
      input.setValue('new-cost-code')
      expect(wrapper.vm.request.cost_code).toEqual('new-cost-code')
      const button = wrapper.find('[data-action="update-request"]')
      await button.trigger('click')
      expect(wrapper.emitted().editCompleted).toBeTruthy()
      expect(mockShowAlert).toBeCalledWith(
        `Sample ${request.sample_name} updated successfully`,
        'success',
      )
    })

    it('does not update the request if there is an error', async () => {
      store.updateRequest = vi
        .fn()
        .mockResolvedValue({ success: false, errors: 'Invalid cost code' })
      const input = wrapper.find('[data-attribute="cost-code"]')
      input.setValue('invalid-cost-code')
      expect(wrapper.vm.request.cost_code).toEqual('invalid-cost-code')
      const button = wrapper.find('[data-action="update-request"]')
      await button.trigger('click')
      expect(mockShowAlert).toBeCalledWith(
        `Error updating sample ${request.sample_name}: ${'Invalid cost code'}`,
        'error',
      )
    })
  })
})

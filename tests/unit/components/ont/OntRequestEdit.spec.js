import { mountWithStore } from '@support/testHelper.js'
import OntRequestEdit from '@/components/ont/OntRequestEdit.vue'
import { useOntRequestsStore } from '@/stores/ontRequests.js'
import OntRequestFactory from '@tests/factories/OntRequestFactory.js'

const ontRequestFactory = OntRequestFactory()

const mountComponent = (props = {}) => {
  const { wrapper, store } = mountWithStore(OntRequestEdit, {
    initialState: {
      ontRequests: {
        resources: {
          requests: ontRequestFactory.storeData,
        },
      },
    },
    props,
    createStore: () => useOntRequestsStore(),
  })
  return { wrapper, store }
}

describe('OntRequestEdit', () => {
  describe.skip('with a valid existing request', () => {
    let wrapper, store, request

    beforeEach(() => {
      request = Object.values(ontRequestFactory.storeData)[0]
      ;({ wrapper, store } = mountComponent({ id: request.id }))
    })

    it('shows the source identifier', () => {
      expect(wrapper.find('[data-attribute="source-identifier"]').text()).toEqual(
        request.source_identifier,
      )
    })

    it('shows the library type', () => {
      expect(wrapper.find('[data-attribute="library-type"]').text()).toEqual(request.library_type)
    })

    it('shows the data type', () => {
      expect(wrapper.find('[data-attribute="data-type"]').text()).toEqual(request.data_type)
    })

    it('shows the number of flowcells', () => {
      expect(wrapper.find('[data-attribute="number-of-flowcells"]').text()).toEqual(
        request.number_of_flowcells,
      )
    })

    it('shows the cost code', () => {
      expect(wrapper.find('[data-attribute="cost-code"]').text()).toEqual(request.cost_code)
    })

    it('shows the external study id', () => {
      expect(wrapper.find('[data-attribute="external-study-id"]').text()).toEqual(
        request.external_study_id,
      )
    })

    it('shows the location', () => {
      expect(wrapper.find('[data-attribute="location"]').text()).toEqual(request.location)
    })

    it('shows the retention instructions', () => {
      expect(wrapper.find('[data-attribute="retention-instructions"]').text()).toEqual(
        request.retention_instructions,
      )
    })

    it('shows the created at date', () => {
      expect(wrapper.find('[data-attribute="created-at"]').text()).toEqual(request.created_at)
    })

    it('validates the form locally', async () => {
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.formIsValid).toBe(true)
    })

    it('submits the form', async () => {
      await wrapper.vm.$nextTick()
      wrapper.vm.submitForm()
      expect(store.actions['ontRequests/updateRequest']).toHaveBeenCalled()
    })

    it('handles form submission failure', async () => {
      store.actions['ontRequests/updateRequest'].mockRejectedValueOnce(
        new Error('Submission failed'),
      )
      await wrapper.vm.$nextTick()
      wrapper.vm.submitForm()
      expect(wrapper.vm.formError).toBe('Submission failed')
    })
  })
})
// test to show and edit number of flowcells
// test to show and edit cost code
// test to show external study id
// test to show location
// test to show and edit retention instructions
// test to show created at
// test for local validation
// test for form submission
// test for form submission failure.

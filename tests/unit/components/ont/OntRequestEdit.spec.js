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
    let wrapper, request

    beforeEach(() => {
      request = Object.values(ontRequestFactory.storeData.resources)[0]
      ;({ wrapper } = mountComponent({ id: request.id }))
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

    it('cancel button emits "editCompleted"', async () => {
      const button = wrapper.find('[data-action="cancel-edit"]')
      await button.trigger('click')
      expect(wrapper.emitted().editCompleted).toBeTruthy()
    })
  })
})

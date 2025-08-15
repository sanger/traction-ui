import { mountWithStore } from '@support/testHelper.js'
import OntRequestEdit from '@/components/ont/OntRequestEdit.vue'
import { useOntRequestsStore } from '@/stores/ontRequests.js'
import OntRequestFactory from '@tests/factories/OntRequestFactory.js'

const ontRequestFactory = OntRequestFactory()

const mountComponent = (props = {}) => {
  const { wrapper, store } = mountWithStore(OntRequestEdit, {
    initialState: {
      ontRequests: {
        requests: ontRequestFactory.storeData,
      },
      props,
      createStore: () => useOntRequestsStore(),
    },
  })
  return { wrapper, store }
}

describe('OntRequestEdit', () => {
  it('renders correctly', () => {
    const { wrapper } = mountComponent({
      props: {
        id: 1,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

// test to show source
// test to show sample name
// test to show and edit library type
// test to show and edit data type
// test to show and edit number of flowcells
// test to show and edit cost code
// test to show external study id
// test to show location
// test to show and edit retention instructions
// test to show created at
// test for local validation
// test for form submission
// test for form submission failure.

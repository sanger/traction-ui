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

import { mountWithStore } from '@support/testHelper.js'
import OntRequestEdit from '@/components/ont/OntRequestEdit.vue'

describe('OntRequestEdit', () => {
  it('renders correctly', () => {
    const { wrapper } = mountWithStore(OntRequestEdit, {
      props: {
        id: 1,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

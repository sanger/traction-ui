import { mountWithStore } from '@support/testHelper.js'
import PacbioRunPoolLibraryList from '@/components/pacbio/PacbioRunPoolLibraryList.vue'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import PacbioRunFactory from '@tests/factories/PacbioRunFactory.js'

const pacbioRunFactory = PacbioRunFactory({ count: 1 })

// experimental
const count =
  pacbioRunFactory.storeData.resources.pools?.length ||
  0 + pacbioRunFactory.storeData.resources.libraries?.length ||
  0

describe('PacbioRunPoolLibraryList', () => {
  let wrapper

  beforeEach(() => {
    ;({ wrapper } = mountWithStore(PacbioRunPoolLibraryList, {
      initialState: {
        pacbioRunCreate: {
          ...pacbioRunFactory.storeData,
        },
      },
      createStore: () => usePacbioRunCreateStore(),
    }))
  })

  it('should render the component correctly', () => {
    // Correct title
    expect(wrapper.text()).toContain('Pools & Libraries')
    // Search input component
    expect(wrapper.find('#labware-finder-input').exists()).toBe(true)
    // 2 pools and 1 library
    expect(wrapper.findAll('[data-attribute="selected-pool-library-list"')).toHaveLength(count)
  })

  it('should remove the selected pool/library when the remove button is clicked', async () => {
    expect(wrapper.findAll('[data-attribute="selected-pool-library-list"')).toHaveLength(count)

    // Remove the first tube found
    const removeButton = wrapper.find('[data-attribute="remove-tube"]')
    await removeButton.trigger('click')

    expect(wrapper.findAll('[data-attribute="selected-pool-library-list"')).toHaveLength(count - 1)
  })
})

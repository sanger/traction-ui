import { mount, createTestingPinia } from '@support/testHelper.js'
import PacbioRunPoolLibraryList from '@/components/pacbio/PacbioRunPoolLibraryList.vue'
import storeRunPools from '@tests/data/StoreRunPools.json'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'

/**
 * Helper method for mounting a component with a mock instance of pinia, with the given 'options'.
 * 'options' allows to define initial state of store while instantiating the component.
 *
 * @param {*} options - options to be passed to the createTestingPinia method for creating a mock instance of pinia
 * options type is
 * {state :{},stubActions: boolean, plugins:[]}
 *
 */
function mountWithStore({ state = {}, stubActions = false, plugins = [] } = {}) {
  const wrapperObj = mount(PacbioRunPoolLibraryList, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioRunCreate: { ...state },
          },
          stubActions,
          plugins,
        }),
      ],
    },
  })
  const storeObj = usePacbioRunCreateStore()
  return { wrapperObj, storeObj }
}

describe('PacbioRunPoolLibraryList', () => {
  let wrapper

  beforeEach(() => {
    const { wrapperObj } = mountWithStore({
      state: {
        ...storeRunPools,
      },
    })
    wrapper = wrapperObj
  })

  it('should render the component correctly', () => {
    // Correct title
    expect(wrapper.text()).toContain('Pools & Libraries')
    // Search input component
    expect(wrapper.find('#labware-finder-input').exists()).toBe(true)
    // 2 pools and 1 library
    expect(wrapper.findAll('[data-attribute="selected-pool-library-list"')).toHaveLength(3)
  })

  it('should remove the selected pool/library when the remove button is clicked', async () => {
    expect(wrapper.findAll('[data-attribute="selected-pool-library-list"')).toHaveLength(3)

    // Remove the first tube found
    const removeButton = wrapper.find('[data-attribute="remove-tube"]')
    await removeButton.trigger('click')

    expect(wrapper.findAll('[data-attribute="selected-pool-library-list"')).toHaveLength(2)
  })
})

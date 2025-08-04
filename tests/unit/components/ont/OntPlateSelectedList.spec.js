import { mountWithStore } from '@support/testHelper.js'
import OntPlateSelectedList from '@/components/ont/OntPlateSelectedList.vue'
import OntPlateFactory from '@tests/factories/OntPlateFactory.js'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'

const ontPlateFactory = OntPlateFactory()

const mountComponent = (selectedPlates = {}) => {
  const { wrapper, store } = mountWithStore(OntPlateSelectedList, {
    initialState: {
      ontPoolCreate: {
        resources: {
          plates: ontPlateFactory.storeData.resources.plates,
          wells: ontPlateFactory.storeData.resources.wells,
        },
        selected: {
          plates: selectedPlates,
        },
      },
    },
    stubs: {
      VueSelecto: true,
    },
    createStore: () => useOntPoolCreateStore(),
  })
  return { wrapper, store }
}

describe('OntPlateSelectedList', () => {
  // let wrapper, store

  it('contains only a no plates selected item when no plates have been selected', () => {
    const { wrapper } = mountComponent()
    expect(wrapper.find('[data-type=warning-message]').text()).toEqual('No plates selected')
    expect(wrapper.findAll('[data-type=warning-message]').length).toEqual(1)
  })

  it('deselects the plate and requests when the remove button is clicked', async () => {
    const { wrapper, store } = mountComponent({ 1: { id: '1', selected: true } })
    const button = wrapper.find('#remove-plate-btn-1')
    await button.trigger('click')
    expect(store.selected.plates).toEqual({})
  })

  it('contains the selected plate', () => {
    const { wrapper } = mountComponent({ 1: { id: '1', selected: true } })
    expect(wrapper.find('[data-type=selected-plate-item]').text()).toContain('GEN-1668092750-1')
  })

  it('selects the requests associated with the well', async () => {
    const { wrapper, store } = mountComponent({ 1: { id: '1', selected: true } })
    store.selectWellRequests = vi.fn()
    const selecto = wrapper.findComponent('.selecto-selection')
    const addedWell = wrapper.findAll('[data-attribute=well]')[0]
    addedWell.getAttribute = vi.fn(() => '1')
    const removedWell = wrapper.findAll('[data-attribute=well]')[1]
    removedWell.getAttribute = vi.fn(() => '2')
    await selecto.vm.$emit('select', {
      added: [addedWell],
      removed: [removedWell],
    })
    expect(store.selectWellRequests).toHaveBeenCalledWith('1')
    expect(store.selectWellRequests).toHaveBeenCalledWith('2')
  })
})

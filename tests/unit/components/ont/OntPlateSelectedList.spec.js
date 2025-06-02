import { mountWithStore } from '@support/testHelper.js'
import OntPlateSelectedList from '@/components/ont/OntPlateSelectedList.vue'
import OntPlateFactory from '@tests/factories/OntPlateFactory.js'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'

const ontPlateFactory = OntPlateFactory()

describe('OntPlateSelectedList', () => {
  let wrapper, store

  beforeEach(() => {
    ;({ wrapper, store } = mountWithStore(OntPlateSelectedList, {
      initialState: {
        ontPoolCreate: {
          resources: {
            plates: ontPlateFactory.storeData.plates,
            wells: ontPlateFactory.storeData.wells,
          },
        },
      },
      stubs: {
        Plate: true,
        VueSelecto: true,
      },
      createStore: () => useOntPoolCreateStore(),
    }))
  })
  it('contains only a no plates selected item when no plates have been selected', () => {
    expect(wrapper.find('[data-type=warning-message]').text()).toEqual('No plates selected')
    expect(wrapper.findAll('[data-type=warning-message]').length).toEqual(1)
  })

  it.skip('deselects the plate and requests when the remove button is clicked', async () => {
    store.selectPlate('1')
    const button = wrapper.find('#remove-plate-btn-1')
    await button.trigger('click')
    expect(store.selected.plates).toEqual([])
  })

  // describe('Plate selection', () => {
  //   beforeEach(() => {
  //     const selectPlate = { id: '1', selected: true }
  //     store.commit('traction/ont/pools/selectPlate', selectPlate)
  //   })

  //   it('contains the selected plate', () => {
  //     expect(wrapper.find('[data-type=selected-plate-item]').text()).toContain('GEN-1668092750-1')
  //   })
  // })

  // describe('Plate@onSelect', () => {
  //   beforeEach(() => {
  //     const selectPlate = { id: '1', selected: true }
  //     store.commit('traction/ont/pools/selectPlate', selectPlate)
  //   })

  //   it('selects the requests associated with the well', async () => {
  //     const dispatch = vi.fn()
  //     store.dispatch = dispatch
  //     const selecto = wrapper.findComponent('.selecto-selection')
  //     const addedWell = wrapper.findAll('[data-attribute=well]')[0]
  //     addedWell.getAttribute = vi.fn(() => '1')
  //     const removedWell = wrapper.findAll('[data-attribute=well]')[1]
  //     removedWell.getAttribute = vi.fn(() => '2')
  //     await selecto.vm.$emit('select', {
  //       added: [addedWell],
  //       removed: [removedWell],
  //     })

  //     expect(dispatch).toHaveBeenCalledWith('traction/ont/pools/selectWellRequests', '1')
  //     expect(dispatch).toHaveBeenCalledWith('traction/ont/pools/selectWellRequests', '2')
  //   })
  // })
})

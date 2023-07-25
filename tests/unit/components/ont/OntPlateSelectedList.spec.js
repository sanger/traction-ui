import { mount, store, Data } from '@support/testHelper'
import OntPlateSelectedList from '@/components/ont/OntPlateSelectedList'
import Response from '@/api/Response'

describe('OntPlateSelectedList', () => {
  let wrapper, mockPlates

  beforeEach(() => {
    const responseBody = new Response(Data.OntPlatesRequest)._body
    mockPlates = responseBody.data
    const mockWells = responseBody.included.slice(0, 16)
    store.commit('traction/ont/pools/populatePlates', mockPlates)
    store.commit('traction/ont/pools/populateWells', mockWells)

    wrapper = mount(OntPlateSelectedList, {
      store,
      stubs: {
        Plate: true,
        VueSelecto: true,
      },
    })
  })

  it('will have a form', () => {
    expect(wrapper.find('.selected-list-group')).toBeDefined()
  })

  it('contains only a no plates selected item when no plates have been selected', () => {
    expect(wrapper.find('[data-type=warning-message]').text()).toEqual('No plates selected')
    expect(wrapper.findAll('[data-type=warning-message]').length).toEqual(1)
  })

  it('deselects the plate and requests when the remove button is clicked', async () => {
    const selectPlate = { id: '1', selected: true }
    await store.commit('traction/ont/pools/selectPlate', selectPlate)
    const dispatch = vi.fn()
    store.dispatch = dispatch
    const button = wrapper.find('#remove-plate-btn-1')
    await button.trigger('click')
    expect(dispatch).toHaveBeenCalledWith(
      'traction/ont/pools/deselectPlateAndContents',
      selectPlate.id,
    )
  })

  describe('Plate selection', () => {
    beforeEach(() => {
      const selectPlate = { id: '1', selected: true }
      store.commit('traction/ont/pools/selectPlate', selectPlate)
    })

    it('contains the selected plate', () => {
      expect(wrapper.find('[data-type=selected-plate-item]').text()).toContain('GEN-1668092750-1')
      expect(wrapper.findAll('.plate').length).toEqual(1)
    })
  })

  describe('Plate@onSelect', () => {
    beforeEach(() => {
      const selectPlate = { id: '1', selected: true }
      store.commit('traction/ont/pools/selectPlate', selectPlate)
    })

    it('selects the requests associated with the well', async () => {
      const dispatch = vi.fn()
      store.dispatch = dispatch
      const selecto = wrapper.findComponent('.selecto-selection')
      await selecto.vm.$emit('select', {
        // I'm not particularly happy with this, and would prefer to test with
        // something a little more realistic. TBH, I'd be happier if we were
        // emitting a vue component.
        added: [{ __vueParentComponent: { attrs: { id: '1' } } }],
        removed: [{ __vueParentComponent: { attrs: { id: '2' } } }],
      })

      expect(dispatch).toHaveBeenCalledWith('traction/ont/pools/selectWellRequests', '1')
      expect(dispatch).toHaveBeenCalledWith('traction/ont/pools/selectWellRequests', '2')
    })
  })
})

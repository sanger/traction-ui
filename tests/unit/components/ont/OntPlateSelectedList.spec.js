import { mount, localVue, store, Data } from '@support/testHelper'
import OntPlateSelectedList from '@/components/ont/OntPlateSelectedList'
import Response from '@/api/Response'

describe('OntPlateSelectedList', () => {
  let wrapper, mockPlates

  beforeEach(() => {
    const responseBody = new Response(Data.OntPlatesRequest)._body
    mockPlates = responseBody.data
    const mockWells = responseBody.included.slice(0, 16)
    store.commit('traction/ont/populatePlates', mockPlates)
    store.commit('traction/ont/populateWells', mockWells)

    wrapper = mount(OntPlateSelectedList, {
      localVue,
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

  describe('Plate selection', () => {
    beforeEach(() => {
      const selectPlate = { id: '1', selected: true }
      store.commit('traction/ont/selectPlate', selectPlate)
    })

    it('contains the selected plate', () => {
      expect(wrapper.find('[data-type=selected-plate-item]').text()).toContain('GEN-1668092750-1')
      expect(wrapper.findAll('plate-stub').length).toEqual(1)
    })
  })

  describe('Plate@onSelect', () => {
    beforeEach(() => {
      const selectPlate = { id: '1', selected: true }
      store.commit('traction/ont/selectPlate', selectPlate)
    })

    it('selects the requests associated with the well', async () => {
      const dispatch = vi.fn()
      store.dispatch = dispatch
      const selecto = wrapper.find('vueselecto-stub')
      await selecto.vm.$emit('select', {
        // I'm not particularly happy with this, and would prefer to test with
        // something a little more realistic. TBH, I'd be happier if we were
        // emitting a vue component.
        added: [{ __vue__: { $attrs: { id: '1' } } }],
        removed: [{ __vue__: { $attrs: { id: '2' } } }],
      })

      expect(dispatch).toHaveBeenCalledWith('traction/ont/selectWellRequests', '1')
      expect(dispatch).toHaveBeenCalledWith('traction/ont/selectWellRequests', '2')
    })
  })
})

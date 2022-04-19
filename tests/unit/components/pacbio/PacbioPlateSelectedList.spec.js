import { mount, localVue, store, Data } from 'testHelper'
import PacbioPlateSelectedList from '@/components/pacbio/PacbioPlateSelectedList'
import Response from '@/api/Response'

describe('PacbioPlateSelectedList', () => {
  let wrapper, mockPlates

  beforeEach(() => {
    const responseBody = new Response(Data.PacbioPlatesRequest)._body
    mockPlates = responseBody.data
    const mockWells = responseBody.included.slice(0, 4)
    store.commit('traction/pacbio/poolCreate/populatePlates', mockPlates)
    store.commit('traction/pacbio/poolCreate/populateWells', mockWells)

    wrapper = mount(PacbioPlateSelectedList, {
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
      let selectPlate = { id: '61', selected: true }
      store.commit('traction/pacbio/poolCreate/selectPlate', selectPlate)
    })

    it('contains the selected plate', () => {
      expect(wrapper.find('[data-type=selected-plate-item]').text()).toContain('DN814327C')
      expect(wrapper.findAll('plate-stub').length).toEqual(1)
    })
  })

  describe('Plate@onSelect', () => {
    beforeEach(() => {
      let selectPlate = { id: '61', selected: true }
      store.commit('traction/pacbio/poolCreate/selectPlate', selectPlate)
    })

    it('selects the requests associated with the well', async () => {
      const dispatch = jest.fn()
      store.dispatch = dispatch
      const selecto = wrapper.find('vueselecto-stub')
      await selecto.vm.$emit('select', {
        // I'm not particularly happy with this, and would prefer to test with
        // something a little more realistic. TBH, I'd be happier if we were
        // emitting a vue component.
        added: [{ __vue__: { $attrs: { id: '1' } } }],
        removed: [{ __vue__: { $attrs: { id: '2' } } }],
      })

      expect(dispatch).toHaveBeenCalledWith('traction/pacbio/poolCreate/selectWellRequests', '1')
      expect(dispatch).toHaveBeenCalledWith('traction/pacbio/poolCreate/selectWellRequests', '2')
    })
  })
})

import { mount, localVue, store, Data } from 'testHelper'
import PacbioLabwareSelectedList from '@/components/pacbio/PacbioLabwareSelectedList'
import Response from '@/api/Response'

describe('PacbioLabwareSelectedList', () => {
  let wrapper, mockPlates

  beforeEach(() => {
    const responseBody = new Response(Data.PacbioPlatesRequest)._body
    mockPlates = responseBody.data
    const mockWells = responseBody.included.slice(0, 4)
    store.commit('traction/pacbio/poolCreate/populatePlates', mockPlates)
    store.commit('traction/pacbio/poolCreate/populateWells', mockWells)

    wrapper = mount(PacbioLabwareSelectedList, {
      localVue,

      store,
      stubs: {
        Plate: true,
      },
    })
  })

  it('will have a form', () => {
    expect(wrapper.find('.selected-list-group')).toBeDefined()
  })

  it('contains only a no plates selected item when no plates have been selected', () => {
    expect(wrapper.find('.list-group-item').text()).toEqual('No plates selected')
    expect(wrapper.findAll('.list-group-item').length).toEqual(1)
  })

  describe('Plate selection', () => {
    beforeEach(() => {
      let selectPlate = { id: '61', selected: true }
      store.commit('traction/pacbio/poolCreate/selectPlate', selectPlate)
    })

    it('contains the selected plate', () => {
      expect(wrapper.find('.list-group-item').text()).toContain('DN814327C')
      expect(wrapper.findAll('plate-stub').length).toEqual(1)
    })
  })

  describe('Plate@clickWell', () => {
    beforeEach(() => {
      let selectPlate = { id: '61', selected: true }
      store.commit('traction/pacbio/poolCreate/selectPlate', selectPlate)
    })

    it('selects the requests associated with the well', async () => {
      const dispatch = jest.fn()
      store.dispatch = dispatch
      const plate = wrapper.find('plate-stub')
      await plate.vm.$emit('clickWell', '1')

      expect(dispatch).toHaveBeenCalledWith('traction/pacbio/poolCreate/selectWellRequests', '1')
    })
  })
})

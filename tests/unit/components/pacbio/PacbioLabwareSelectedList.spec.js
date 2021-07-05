import { mount, localVue, store, Data } from 'testHelper'
import PacbioLabwareSelectedList from '@/components/pacbio/PacbioLabwareSelectedList'
import Response from '@/api/Response'

describe('PacbioLabwareSelectedList', () => {
  let wrapper, mockPlates, plateStub

  beforeEach(() => {
    mockPlates = new Response(Data.PacbioPlates)._body.data
    store.commit('traction/pacbio/poolCreate/populatePlates', mockPlates)

    plateStub = {
      template: '<div class="plate"></div>',
    }

    wrapper = mount(PacbioLabwareSelectedList, {
      localVue,
      store,
      stubs: {
        Plate: plateStub,
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
      let selectPlate = { id: '1', selected: true }
      store.commit('traction/pacbio/poolCreate/selectPlate', selectPlate)
    })

    it('contains the selected plate', () => {
      expect(wrapper.find('.list-group-item').text()).toContain('DN1')
      expect(wrapper.findAll('.plate').length).toEqual(1)
    })

    it('unselects a selected plate when unselect button is pressed', () => {
      let button = wrapper.find('#unselect-btn')
      button.trigger('click')
      wrapper.vm.$nextTick(() => {
        expect(wrapper.find('.list-group-item').text()).toEqual('No plates selected')
        expect(wrapper.findAll('.plate').length).toEqual(0)
        expect(wrapper.findAll('.list-group-item').length).toEqual(1)
      })
    })
  })
})

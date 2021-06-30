import { mount, localVue, store, Data } from '../../testHelper'
import PacbioLabwareFind from '@/components/pacbio/PacbioLabwareFind'
import Response from '@/api/Response'

describe('PacbioLabwareFind', () => {
  let wrapper, mockPlates

  beforeEach(() => {
    mockPlates = new Response(Data.PacbioPlates)._body.data
    store.commit('traction/pacbio/poolCreate/populatePlates', mockPlates)

    wrapper = mount(PacbioLabwareFind, {
      localVue,
      store,
    })
  })

  it('will have a form', () => {
    expect(wrapper.find('.labware-list')).toBeDefined()
  })

  it('contains the correct data', () => {
    expect(wrapper.find('.list-group').findAll('.list-group-item').length).toEqual(2)
  })

  it('filters the list when the input is entered', () => {
    wrapper.vm.enteredLabware = 'DN1'
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.list-group').findAll('.list-group-item').length).toEqual(1)
    })
  })
})

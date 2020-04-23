import OntPlates from '@/views/ont/OntPlates'
import OntPlate from '@/components/ont/OntPlate'
import { mount, localVue } from '../../testHelper'

describe('OntPlates.vue', () => {
  let wrapper, plates

  beforeEach(() => {
    wrapper = mount(OntPlates, {
      localVue,
      stubs: {
        OntPlate: true
      }
    })
    plates = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('OntPlates')
  })

  it('will have a table with plates', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  // TODO: Add GraphQL mocks for below
  it.skip('will have a table with plates', () => {
    expect(wrapper.find('tbody').findAll('tr').length).toEqual(4)
  })

  describe.skip('#getPlates', () => {
    it('gets the plates', () => {
      expect(plates.getPlates().length).toEqual(4)
    })
  })

  describe.skip('Plate display button', () => {
    let button

    it('is present for each plate', () => {
      button = wrapper.find('#details-btn-1')
      expect(button.text()).toEqual('Show Plate')
    })

    it('has a OntPlate component on button click', () => {
      button = wrapper.find('#details-btn-1')
      button.trigger('click')
      expect(wrapper.contains(OntPlate)).toBe(true)
    })
  })

})
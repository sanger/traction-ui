import OntPlateDislay from '@/components/ont/OntPlateDislay'
import OntPlate from '@/components/ont/OntPlate'

import { mount, localVue } from '../../testHelper'

describe('OntPlateDisplay.vue', () => {
  let wrapper, plate

  beforeEach(() => {
    wrapper = mount(OntPlateDislay, { 
      localVue,
      propsData: { plate_id: 1 },
    })
    plate = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('OntPlateDisplay')
  })

  it('will be passed a plate id as a prop', () => {
    expect(plate.plate_id).toBeDefined()
  })

  // This will be updated with GraphQL 
  describe('#getPlate', () => {
    it('gets a plate', () => {
      expect(plate.getPlate()).toBeDefined()
    })
  })

  it('has a OntPlate component', () => {
    expect(wrapper.contains(OntPlate)).toBe(true)
  })
})
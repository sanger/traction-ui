import OntPlateDislay from '@/components/ont/OntPlateDislay'
import OntPlate from '@/components/ont/OntPlate'

import { localVue, mount } from '../../testHelper'

describe('OntPlateDisplay.vue', () => {
  let wrapper, plate

  beforeEach(() => {
    wrapper = mount(OntPlateDislay, { 
      localVue,
      propsData: { plate_id: 1 },
      stubs: {
        OntPlate: true
      }
    })
    plate = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('OntPlateDisplay')
  })

  it('will be passed a plate id as a prop', () => {
    expect(plate.plate_id).toBeDefined()
  })

  it('has a OntPlate component', () => {
    expect(wrapper.contains(OntPlate)).toBe(true)
  })

  describe.skip('apollo', () => {
    it('gets the wells for a given plate id', () => {
      const query = jest.fn()
      query.mockResolvedValue([{id: 1, position: ''}])

      wrapper = mount(OntPlateDislay, {
        localVue,
        stubs: {
          OntPlate: true
        },
        mocks: {
          $apollo: {
            queries: {
              wells: {
                query
              }
            }
          }
        },
      })
      plate = wrapper.vm
      expect(plate.$apollo.queries.wells.query).toBeCalled()
    })
  })
})
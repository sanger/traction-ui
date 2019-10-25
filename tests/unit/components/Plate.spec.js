import { mount, localVue } from '../testHelper'
import Plate from '@/components/PacbioPlate'
import wells from '../../data/wells'

describe('Plate.vue', () => {

  let plate, wrapper

  beforeEach(() => {
    wrapper = mount(Plate, { localVue, propsData: { wells: wells} })
    plate = wrapper.vm
  })

  it('must have some wells', () => {
    expect(plate.wells).toEqual(wells)
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Plate')
  })

  it('will have some headers', () => {
    //include extra header for column name
    expect(wrapper.findAll('th').length).toEqual(plate.columns.length+1)
  })

  it('will have some rows', () => {
    expect(wrapper.findAll('tr').length).toEqual(8)
  })

})
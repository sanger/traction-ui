import { mount, localVue } from '../testHelper'
import Plate from '@/components/Plate'

describe('Plate.vue', () => {

  let plate, wrapper

  beforeEach(() => {
    wrapper = mount(Plate, { localVue})
    plate = wrapper.vm
  })

  it('will be defined', () => {
    expect(plate).toBeDefined()
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Plate')
  })

})
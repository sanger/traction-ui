import OntPlates from '@/views/ont/OntPlates'
import { mount } from '../../testHelper'

describe('Plates.vue', () => {
  let plates, wrapper

  beforeEach(() => {
    wrapper = mount(OntPlates)
    plates = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Plates')
  })
})
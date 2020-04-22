import OntPlates from '@/views/ont/OntPlates'
import { mount } from '../../testHelper'

describe('Plates.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(OntPlates)
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('OntPlates')
  })
})
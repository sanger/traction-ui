import { mount, localVue } from '../testHelper'
import Tube from '@/components/Tube'

describe('Tube.vue', () => {

  let tube, wrapper, props

  beforeEach(() => {
    props = {  }

    wrapper = mount(Tube, { 
      localVue, 
      propsData: props,
    })

    tube = wrapper.vm
  })

  it('works', () => {
    expect(true).toBeTruthy()
  })

})
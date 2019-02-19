import Runs from '@/views/Runs'
import { mount, localVue } from '../testHelper'
import VueRouter from 'vue-router'

describe('Runs.vue', () => {

  let wrapper, data

  beforeEach(() => {
    const router = new VueRouter()
    wrapper = mount(Runs, { localVue, router })
  })

  it('contains a create new run button', () => {
    expect(wrapper.contains('button')).toBe(true)
  })

})

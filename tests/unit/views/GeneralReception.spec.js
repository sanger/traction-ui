import { shallowMount } from '@support/testHelper'
import Reception from '@/views/GeneralReception.vue'

describe('GeneralReception', () => {
  it('generates a wrapper', () => {
    const wrapper = shallowMount(Reception)
    expect(wrapper).toBeTruthy()
  })
})

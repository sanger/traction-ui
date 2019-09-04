import Pacbio from '@/views/Pacbio'
import { mount, localVue, store } from '../testHelper'
import VueRouter from 'vue-router'

describe('Pacbio.vue', () => {

  let wrapper, router

  beforeEach(() => {
    router = new VueRouter()
    wrapper = mount(Pacbio, { router, localVue,
      store }
    )
  })

  it('will have a title', () => {
    expect(wrapper.find('h4').text()).toEqual('Pacbio')
  })

  it('will have some navigation', () => {
    expect(wrapper.find('nav').findAll('a').length).toBeTruthy()
  })

})

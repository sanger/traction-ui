import Saphyr from '@/views/Saphyr'
import { mount, localVue, store } from '../testHelper'
import VueRouter from 'vue-router'

describe('Saphyr.vue', () => {

  let wrapper, router

  beforeEach(() => {
    router = new VueRouter()
    wrapper = mount(Saphyr, { router, localVue,
      store }
    )
  })

  it('will have a title', () => {
    expect(wrapper.find('h4').text()).toEqual('Saphyr')
  })

  it('will have some navigation', () => {
    expect(wrapper.find('nav').findAll('a').length).toBeTruthy()
  })

})


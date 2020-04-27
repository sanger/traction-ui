import { mount, localVue } from '../testHelper'
import InfoFooter from '@/components/InfoFooter'

describe('infoFooter.vue', () => {

  let wrapper

  beforeEach(() => {
    wrapper = mount(InfoFooter, { localVue })
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('infoFooter')
  })

  it('has a environment', () => {
    wrapper.setData({ environment: 'development' })
    expect(wrapper.vm.environment).toBe('development')
  })

  it('has a host name', () => {
    wrapper.setData({ host_name: 'localhost' })
    expect(wrapper.vm.host_name).toBe('localhost')
  })
})
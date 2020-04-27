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

  it('has a release tag', () => {
    wrapper.setData({ release: '1' })
    expect(wrapper.vm.release).toBe('1')
  })

  it('has a repo data', () => {
    wrapper.setData({ repo: 'uat' })
    expect(wrapper.vm.repo).toBe('uat')
  })
})
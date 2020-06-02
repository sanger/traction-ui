import { mount, localVue } from '../testHelper'
import InfoFooter from '@/components/InfoFooter'

describe('infoFooter.vue', () => {

  let wrapper

  beforeEach(() => {
    wrapper = mount(InfoFooter, {
      localVue,
      methods: {
        provider() { return }
      } 
    })
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('infoFooter')
  })

  it('has a environment', () => {
    wrapper.setData({ environment: 'development' })
    expect(wrapper.vm.environment).toBe('development')
  })

  it('has a repo data', () => {
    wrapper.setData({ repo: 'trac-ui' })
    expect(wrapper.vm.repo).toBe('trac-ui')
  })
})
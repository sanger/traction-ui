import { mount, localVue } from '../testHelper'
import InfoFooter from '@/components/InfoFooter'

describe('infoFooter.vue', () => {

  let wrapper

  beforeEach(() => {
    wrapper = mount(InfoFooter, {
      localVue,
      data () {
        return {
          environment: 'development',
          repo: 'trac-ui'
        }
      }
    })
  })

  it.skip('test fetch properly', () => {

  })

  it('has a environment', () => {
    expect(wrapper.vm.environment).toBe('development')
  })

  it('has a repo data', () => {
    expect(wrapper.vm.repo).toBe('trac-ui')
  })
})
import InfoFooter from '@/components/InfoFooter'
import { localVue, mount } from 'testHelper'

describe('InfoFooter.vue', () => {
  let wrapper

  beforeEach(() => {
    let response = {
      status: 200,
      statusText: 'OK',
      data: { errors: {} },
      text: function text() {
        return 'text'
      },
    }
    global.fetch = jest.fn(() => Promise.resolve(response))

    wrapper = mount(InfoFooter, {
      localVue,
    })
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

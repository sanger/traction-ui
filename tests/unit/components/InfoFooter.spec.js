import InfoFooter from '@/components/InfoFooter'
import { localVue, mount } from '@support/testHelper'

describe('InfoFooter.vue', () => {
  let wrapper

  beforeEach(() => {
    const response = {
      status: 200,
      statusText: 'OK',
      data: { errors: {} },
      text: function text() {
        return 'text'
      },
    }
    global.fetch = vi.fn(() => Promise.resolve(response))

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

  describe('getRelease method', () => {
    it('returns "Releases" when repo equals default release', () => {
      const defaultRelease = 'https://github.com/sanger/traction-ui/releases'
      wrapper.setData({ repo: defaultRelease })
      expect(wrapper.vm.getRelease()).toEqual('Releases')
    })

    it('returns a sliced version of repo when repo doesnt equal default release', () => {
      const exampleRelease = 'https://github.com/sanger/traction-ui/releases/tag/12345'
      wrapper.setData({ repo: exampleRelease })
      expect(wrapper.vm.getRelease()).toEqual('12345')
    })
  })
})

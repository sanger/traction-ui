import { localVue, mount } from '@support/testHelper'
import { startMirage } from '@tests/_mirage_'
import FlaggedFeature from '@/components/shared/FlaggedFeature'

describe.todo('FlaggedFeature.vue', () => {
  let mirageServer

  beforeEach(() => {
    mirageServer = startMirage()
  })

  afterEach(() => {
    mirageServer.shutdown()
  })

  const buildWrapper = (props = {}) => {
    return mount(FlaggedFeature, {
      localVue,
      propsData: props,
      slots: {
        default: 'Feature Content',
        disabled: 'Disabled Content',
      },
    })
  }

  it('displays the slot when the flag is true', () => {
    const wrapper = buildWrapper({ name: 'enable_feature' })
    expect(wrapper.text()).toContain('Feature Content')
  })

  it('hides the slot when the flag is true', () => {
    const wrapper = buildWrapper({ name: 'disabled_feature' })
    expect(wrapper.text()).not.toContain('Feature Content')
  })

  it('hides the disabled slot when the flag is true', () => {
    const wrapper = buildWrapper({ name: 'enable_feature' })
    expect(wrapper.text()).toContain('Disabled Content')
  })

  it('displays the disabled slot when the flag is true', () => {
    const wrapper = buildWrapper({ name: 'disabled_feature' })
    expect(wrapper.text()).not.toContain('Disabled Content')
  })
})

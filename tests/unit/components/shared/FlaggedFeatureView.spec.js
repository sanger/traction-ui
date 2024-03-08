import { mount } from '@support/testHelper'
import FlaggedFeatureView from '@/components/shared/FlaggedFeatureView.vue'
import { markRaw } from 'vue'

const componentEnabled = markRaw({
  template: '<div>Enabled</div>',
})
const componentDisabled = markRaw({
  template: '<div>Disabled</div>',
})
describe('FlaggedFeatureView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mock('swrv', () => ({
      default: vi.fn(() => ({
        data: {
          flipper_id: 'User 1',
          features: {
            enable_feature: { enabled: true },
            disabled_feature: { enabled: false },
          },
        },
      })),
    }))
  })

  const buildWrapper = (props = {}) => {
    return mount(FlaggedFeatureView, {
      props,
    })
  }

  it('displays the conponentOnFeatureEnable when the flag is true', () => {
    const wrapper = buildWrapper({
      feature: 'enable_feature',
      componentOnFeatureEnable: componentEnabled,
      componentOnFeatureDisable: componentDisabled,
    })
    expect(wrapper.text()).toContain('Enabled')
  })

  it('displays the conponentOnFeatureDisable when the flag is false', () => {
    const wrapper = buildWrapper({
      feature: 'disable_feature',
      componentOnFeatureEnable: componentEnabled,
      componentOnFeatureDisable: componentDisabled,
    })
    expect(wrapper.text()).toContain('Disabled')
  })
})

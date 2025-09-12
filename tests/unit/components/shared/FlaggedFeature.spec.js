import { mount } from '@support/testHelper.js'
import FlaggedFeature from '@/components/shared/FlaggedFeature.vue'

describe('FlaggedFeature.vue', () => {
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
    return mount(FlaggedFeature, {
      props,
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

  it('hides the slot when the flag is false', () => {
    const wrapper = buildWrapper({ name: 'disabled_feature' })
    expect(wrapper.text()).not.toContain('Feature Content')
  })

  it('hides the disabled slot when the flag is true', () => {
    const wrapper = buildWrapper({ name: 'enable_feature' })
    expect(wrapper.text()).not.toContain('Disabled Content')
  })

  it('displays the disabled slot when the flag is false', () => {
    const wrapper = buildWrapper({ name: 'disabled_feature' })
    expect(wrapper.text()).toContain('Disabled Content')
  })

  it('hides the slot when the flag is unknown', () => {
    const wrapper = buildWrapper({ name: 'unknown_feature' })
    expect(wrapper.text()).not.toContain('Feature Content')
  })

  it('displays the disabled slot when the flag is unknown', () => {
    const wrapper = buildWrapper({ name: 'unknown_feature' })
    expect(wrapper.text()).toContain('Disabled Content')
  })
})

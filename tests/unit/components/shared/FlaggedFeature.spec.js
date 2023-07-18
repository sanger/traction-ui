import { mount } from '@support/testHelper'

import FlaggedFeature from '@/components/shared/FlaggedFeature'
import { vi } from 'vitest'

describe('FlaggedFeature.vue', () => {
  beforeEach(() => {
    // Ideally I'd love to mock the http response here, but swrv seems to tun
    // into problems mounting via-vue test utils, and `getCurrentInstance` fails
    // to find the instance
    vi.mock('swrv', () => ({
      default: vi.fn(() => ({
        data: {
          flipper_id: 'User',
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
      props: props,
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

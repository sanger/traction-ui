import { mountWithStore, successfulResponse, flushPromises } from '@support/testHelper.js'
import FlaggedFeatureView from '@/components/shared/FlaggedFeatureView.vue'
import { markRaw } from 'vue'

const componentEnabled = markRaw({
  template: '<div>Enabled</div>',
})
const componentDisabled = markRaw({
  template: '<div>Disabled</div>',
})

const flipperResponse = {
  flipper_id: 'User 1',
  features: {
    enable_feature: { enabled: true },
    disabled_feature: { enabled: false },
  },
}

const buildWrapper = (props = {}) => {
  return mountWithStore(FlaggedFeatureView, {
    props,
    slots: {
      default: 'Feature Content',
      disabled: 'Disabled Content',
    },
    plugins: [
      ({ store }) => {
        if (store.$id === 'root') {
          store.api.traction.feature_flags.get = vi.fn(() =>
            successfulResponse({ statusCode: '200', data: flipperResponse }),
          )
        }
      },
    ],
  })
}

describe('FlaggedFeatureView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays the conponentOnFeatureEnable when the flag is true', async () => {
    const { wrapper } = buildWrapper({
      feature: 'enable_feature',
      componentOnFeatureEnable: componentEnabled,
      componentOnFeatureDisable: componentDisabled,
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Enabled')
    expect(wrapper.text()).not.toContain('Disabled')
  })

  it('displays the conponentOnFeatureDisable when the flag is false', async () => {
    const { wrapper } = buildWrapper({
      feature: 'disable_feature',
      componentOnFeatureEnable: componentEnabled,
      componentOnFeatureDisable: componentDisabled,
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Disabled')
    expect(wrapper.text()).not.toContain('Enabled')
  })
})

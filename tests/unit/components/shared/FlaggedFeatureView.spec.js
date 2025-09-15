import { mountWithStore, flushPromises } from '@support/testHelper.js'
import FlaggedFeatureView from '@/components/shared/FlaggedFeatureView.vue'
import { markRaw } from 'vue'
import FlipperFactory from '@tests/factories/FlipperFactory.js'

const flipperFactory = FlipperFactory()

const componentEnabled = markRaw({
  template: '<div>Enabled</div>',
})
const componentDisabled = markRaw({
  template: '<div>Disabled</div>',
})

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
          store.api.traction.feature_flags.get = vi.fn(() => flipperFactory.responses.fetch)
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

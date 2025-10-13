import { mountWithStore, flushPromises } from '@support/testHelper.js'
import FlaggedFeature from '@/components/shared/FlaggedFeature.vue'
import useRootStore from '@/stores'
import FlipperFactory from '@tests/factories/FlipperFactory.js'

const flipperFactory = FlipperFactory()

const buildWrapper = (props = {}) => {
  return mountWithStore(FlaggedFeature, {
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
    createStore: () => useRootStore(),
  })
}

describe('FlaggedFeature.vue', () => {
  it('displays the slot when the flag is true', async () => {
    const { wrapper } = buildWrapper({ name: 'enable_feature' })
    await flushPromises()
    expect(wrapper.text()).toContain('Feature Content')
  })

  it('hides the slot when the flag is false', async () => {
    const { wrapper } = buildWrapper({ name: 'disabled_feature' })
    await flushPromises()
    expect(wrapper.text()).not.toContain('Feature Content')
  })

  it('hides the disabled slot when the flag is true', async () => {
    const { wrapper } = buildWrapper({ name: 'enable_feature' })
    await flushPromises()
    expect(wrapper.text()).not.toContain('Disabled Content')
  })

  it('displays the disabled slot when the flag is false', async () => {
    const { wrapper } = buildWrapper({ name: 'disabled_feature' })
    await flushPromises()
    expect(wrapper.text()).toContain('Disabled Content')
  })

  it('hides the slot when the flag is unknown', async () => {
    const { wrapper } = buildWrapper({ name: 'unknown_feature' })
    await flushPromises()
    expect(wrapper.text()).not.toContain('Feature Content')
  })

  it('displays the disabled slot when the flag is unknown', async () => {
    const { wrapper } = buildWrapper({ name: 'unknown_feature' })
    await flushPromises()
    expect(wrapper.text()).toContain('Disabled Content')
  })
})

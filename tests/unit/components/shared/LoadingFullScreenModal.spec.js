import { localVue, mount } from '@support/testHelper'

import LoadingFullScreenModal from '@/components/shared/LoadingFullScreenModal'

describe('LoadingFullScreenModal.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(LoadingFullScreenModal, {
      localVue,
      propsData: props,
    })
  }

  it('displays when true', () => {
    const wrapper = buildWrapper({ visible: true, message: 'Loading' })
    expect(wrapper.text()).toContain('Loading')
  })

  it('is hidden when true', () => {
    const wrapper = buildWrapper({ visible: false, message: 'Loading' })
    expect(wrapper.text()).not.toContain('Loading')
  })
})

import { localVue, mount } from '@support/testHelper'

import TractionButton from '@/components/shared/TractionButton'

describe('TractionButton.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionButton, {
      localVue,
      propsData: props,
      slots: {
        default: 'Section Content',
      },
    })
  }

  it('displays the content', () => {
    const wrapper = buildWrapper({})
    expect(wrapper.text()).toContain('Section Content')
  })

  it('uses the default theme by default', () => {
    const wrapper = buildWrapper({})
    expect(wrapper.attributes('class')).toContain('bg-sdb-400')
  })

  it('supports a create theme', () => {
    const wrapper = buildWrapper({ theme: 'create' })
    expect(wrapper.attributes('class')).toContain('bg-green')
  })
})

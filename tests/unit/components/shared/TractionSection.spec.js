import { localVue, mount } from '@support/testHelper'

import TractionSection from '@/components/shared/TractionSection'

describe('TractionSection.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionSection, {
      localVue,
      propsData: props,
      slots: {
        default: 'Section Content',
        icon: 'Section Icon',
      },
    })
  }

  it('displays the title', () => {
    const wrapper = buildWrapper({ title: 'My title' })
    expect(wrapper.text()).toContain('My title')
  })

  it('displays the content', () => {
    const wrapper = buildWrapper({ title: 'My title' })
    expect(wrapper.text()).toContain('Section Content')
  })

  it('displays the icon', () => {
    const wrapper = buildWrapper({ title: 'My title' })
    expect(wrapper.text()).toContain('Section Icon')
  })
})

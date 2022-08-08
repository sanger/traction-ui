import { localVue, mount } from '@support/testHelper'

import TractionMenuItem from '@/components/shared/TractionMenuItem'

describe('TractionMenuItem.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionMenuItem, {
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
})

import { localVue, mount } from '@support/testHelper'

import TractionMenu from '@/components/shared/TractionMenu'

describe('TractionMenu.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionMenu, {
      localVue,
      props: props,
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

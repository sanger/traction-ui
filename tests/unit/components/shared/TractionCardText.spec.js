import { localVue, mount } from '@support/testHelper'

import TractionCardText from '@/components/shared/TractionCardText'

describe('TractionCardText.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionCardText, {
      localVue,
      propsData: props,
      slots: {
        default: 'Card Text',
      },
    })
  }

  it('displays the content', () => {
    const wrapper = buildWrapper({})
    expect(wrapper.text()).toContain('Card Text')
  })
})

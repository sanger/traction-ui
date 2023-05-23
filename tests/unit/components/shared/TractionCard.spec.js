import { localVue, mount } from '@support/testHelper'

import TractionCard from '@/components/shared/TractionCard'

describe('TractionCard.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionCard, {
      localVue,
      propsData: props,
      slots: {
        default: 'Card Content',
      },
    })
  }

  it('displays the content', () => {
    const wrapper = buildWrapper({})
    expect(wrapper.text()).toContain('Card Content')
  })
})

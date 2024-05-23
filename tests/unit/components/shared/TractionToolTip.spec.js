import { mount } from '@vue/test-utils'
import TractionTooltip from '@/components/shared/TractionTooltip.vue'

describe('TractionTooltip.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(TractionTooltip, {
      props: {
        tooltipText: 'Test Tooltip',
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays tooltip text when hover is true', async () => {
    const wrapper = mount(TractionTooltip, {
      props: {
        tooltipText: 'Test Tooltip',
      },
    })
    await wrapper.trigger('mouseover')
    expect(wrapper.get('#tooltip-text').isVisible()).toBe(true)
  })

  it('hides tooltip text when hover is false', async () => {
    const wrapper = mount(TractionTooltip, {
      props: {
        tooltipText: 'Test Tooltip',
      },
    })
    await wrapper.trigger('mouseover')
    await wrapper.trigger('mouseleave')
    expect(wrapper.get('#tooltip-text').isVisible()).toBe(false)
  })
})

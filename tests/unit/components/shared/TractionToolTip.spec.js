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
    expect(wrapper.get('#tooltip').isVisible()).toBe(true)
    expect(wrapper.get('#tooltip').text()).toBe('Test Tooltip')
  })

  it('hides tooltip text when hover is false', async () => {
    const wrapper = mount(TractionTooltip, {
      props: {
        tooltipText: 'Test Tooltip',
      },
    })
    await wrapper.trigger('mouseover')
    await wrapper.trigger('mouseleave')
    expect(wrapper.get('#tooltip').isVisible()).toBe(false)
  })
  it('displays slot content when tooltipText is not provided', async () => {
    const wrapper = mount(TractionTooltip, {
      slots: {
        tooltip: '<div>Slot Tooltip Content</div>',
      },
    })
    await wrapper.trigger('mouseover')
    expect(wrapper.get('#tooltip').isVisible()).toBe(true)
    expect(wrapper.get('#tooltip').html()).toContain('Slot Tooltip Content')
  })

  it('displays default slot content when neither tooltipText nor slot content is provided', async () => {
    const wrapper = mount(TractionTooltip)
    await wrapper.trigger('mouseover')
    expect(wrapper.get('#tooltip').isVisible()).toBe(true)
    expect(wrapper.get('#tooltip').text()).toBe('No tooltip content available.')
  })
})

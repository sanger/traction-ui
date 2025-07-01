import { mount } from '@vue/test-utils'
import TractionTooltip from '@/components/shared/TractionTooltip.vue'
import { expect } from 'vitest'

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
    expect(wrapper.get('#tooltip').classes()).toEqual(
      expect.arrayContaining(['bg-yellow-400', 'text-gray-700']),
    )
    expect(wrapper.get('#tooltip').html()).toContain('Slot Tooltip Content')
  })

  it('applies the provided tooltip classes', async () => {
    const wrapper = mount(TractionTooltip, {
      props: {
        tooltipText: 'Test Tooltip',
        tooltipBgColour: 'bg-red-500',
        tooltipTextColour: 'text-white',
        tooltipDirection: 'top-[-100px] left-2',
        tooltipWrap: 'text-wrap',
      },
    })
    await wrapper.trigger('mouseover')
    expect(wrapper.get('#tooltip').classes()).toEqual(
      expect.arrayContaining(['bg-red-500', 'text-white', 'top-[-100px]', 'left-2', 'text-wrap']),
    )
  })

  it('displays default slot content when neither tooltipText nor slot content is provided', async () => {
    const wrapper = mount(TractionTooltip)
    await wrapper.trigger('mouseover')
    expect(wrapper.get('#tooltip').isVisible()).toBe(true)
    expect(wrapper.get('#tooltip').text()).toBe('No tooltip content available.')
  })
})

import { mount } from '@vue/test-utils'
import TractionTooltip from '@/components/shared/TractionTooltip.vue'
import { expect } from 'vitest'

describe('TractionTooltip.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders correctly', () => {
    wrapper = mount(TractionTooltip, {
      props: {
        tooltipText: 'Test Tooltip',
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays tooltip text when hover is true', async () => {
    wrapper = mount(TractionTooltip, {
      attachTo: document.body,
      props: {
        tooltipText: 'Test Tooltip',
      },
    })
    await wrapper.trigger('mouseover')
    expect(wrapper.get('#tooltip').isVisible()).toBe(true)
    expect(wrapper.get('#tooltip').text()).toBe('Test Tooltip')
  })

  it('hides tooltip text when hover is false', async () => {
    wrapper = mount(TractionTooltip, {
      attachTo: document.body,
      props: {
        tooltipText: 'Test Tooltip',
      },
    })
    expect(wrapper.get('#tooltip').isVisible()).toBe(false)
    await wrapper.trigger('mouseover')
    expect(wrapper.get('#tooltip').isVisible()).toBe(true)
    await wrapper.trigger('mouseleave')
    expect(wrapper.get('#tooltip').isVisible()).toBe(false)
  })

  it('displays slot content when tooltipText is not provided', async () => {
    wrapper = mount(TractionTooltip, {
      attachTo: document.body,
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
    wrapper = mount(TractionTooltip, {
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
    wrapper = mount(TractionTooltip, { attachTo: document.body })
    await wrapper.trigger('mouseover')
    expect(wrapper.get('#tooltip').isVisible()).toBe(true)
    expect(wrapper.get('#tooltip').text()).toBe('No tooltip content available.')
  })
})

import { mount } from '@vue/test-utils'
import TractionBadge from '@/components/shared/TractionBadge.vue'

describe('TractionBadge', () => {
  it('renders the badge text', () => {
    const wrapper = mount(TractionBadge, {
      slots: {
        default: 'Badge Text',
      },
    })
    expect(wrapper.text()).toBe('Badge Text')
  })

  it('applies the correct color class', () => {
    const colors = ['blue', 'green', 'red', 'orange', 'purple', 'grey']
    colors.forEach((color) => {
      const wrapper = mount(TractionBadge, {
        propsData: {
          color,
        },
      })
      expect(wrapper.classes()).toContain(`badge-${color}`)
    })
  })

  it('applies the default color class if no color prop is provided', () => {
    const wrapper = mount(TractionBadge)
    expect(wrapper.classes()).toContain('badge-blue')
  })

  it('applies an invalid color class if an invalid color prop is provided', () => {
    const wrapper = mount(TractionBadge, {
      propsData: {
        color: 'invalid',
      },
    })
    expect(wrapper.classes()).toContain('badge-invalid')
  })
})

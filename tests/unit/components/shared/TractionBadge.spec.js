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
    const colors = {
      black: 'bg-black',
      white: 'bg-white',
      gray: 'bg-gray-200',
      red: 'bg-red-200',
      orange: 'bg-orange-300',
      yellow: 'bg-yellow-300',
      green: 'bg-green-200',
      teal: 'bg-teal-200',
      blue: 'bg-blue-200',
      indigo: 'bg-indigo-200',
      purple: 'bg-purple-200',
      pink: 'bg-pink-200',
      sdb: 'bg-sdb-200',
      'sanger-dark-blue': 'bg-sdb-200',
      sp: 'bg-sp-400',
      'sanger-pink': 'bg-sp-400',
      success: 'bg-success-dark',
      warning: 'bg-warning-dark',
      failure: 'bg-failure-dark',
    }

    for (const [colorName, bgClass] of Object.entries(colors)) {
      const wrapper = mount(TractionBadge, {
        propsData: { color: colorName },
      })
      expect(wrapper.classes()).toContain(bgClass)
    }
  })

  it('applies the default color class if no color prop is provided', () => {
    const wrapper = mount(TractionBadge)
    expect(wrapper.classes()).toContain('bg-sdb-200') // sanger-dark-blue
  })

  it('applies no color class if an invalid color prop is provided', () => {
    const wrapper = mount(TractionBadge, {
      propsData: { color: 'invalid' },
    })
    expect(wrapper.classes()).not.toContain('bg-invalid')
    expect(wrapper.classes()).not.toContain('bg-sdb-200')
  })
})

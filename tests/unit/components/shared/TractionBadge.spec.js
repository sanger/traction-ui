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

  it('applies the correct colour class', () => {
    const colours = {
      black: 'bg-black',
      white: 'bg-white',
      gray: 'bg-gray-200',
      red: 'bg-red-200',
      orange: 'bg-orange-300',
      yellow: 'bg-yellow-300',
      green: 'bg-green-200',
      blue: 'bg-blue-200',
      purple: 'bg-purple-200',
      sdb: 'bg-sdb-200',
      'sanger-dark-blue': 'bg-sdb-200',
      sp: 'bg-sp-400',
      'sanger-pink': 'bg-sp-400',
      'sanger-green': 'bg-green-400',
      success: 'bg-success-dark',
      warning: 'bg-warning-dark',
      failure: 'bg-failure-dark',
    }

    for (const [colourName, bgClass] of Object.entries(colours)) {
      const wrapper = mount(TractionBadge, {
        propsData: { colour: colourName },
      })
      expect(wrapper.classes()).toContain(bgClass)
    }
  })

  it('applies the default color class if no color prop is provided', () => {
    const wrapper = mount(TractionBadge)
    expect(wrapper.classes()).toContain('bg-sdb-200') // sanger-dark-blue
  })

  it('applies no color class if an invalid color prop is provided', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(TractionBadge, {
      propsData: { colour: 'invalid' },
    })
    expect(console.warn).toHaveBeenCalled()
    expect(wrapper.classes()).not.toContain('bg-invalid')
    expect(wrapper.classes()).not.toContain('bg-sdb-200')
  })

  it('provides lists of valid colors', () => {
    expect(TractionBadge.colours.grays).toEqual(['black', 'white', 'gray'])
    expect(TractionBadge.colours.spectrum).toEqual([
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'purple',
    ])
    expect(TractionBadge.colours.sanger).toEqual([
      'sdb',
      'sanger-dark-blue',
      'sp',
      'sanger-pink',
      'sanger-green',
      'sanger-yellow',
    ])
    expect(TractionBadge.colours.statuses).toEqual(['success', 'warning', 'failure'])
  })
})

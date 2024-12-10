import { mount } from '@support/testHelper'

import TractionSpinner from '@/components/shared/TractionSpinner'

describe('TractionSpinner.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionSpinner, {
      props,
    })
  }

  it('displays the default color', () => {
    const wrapper = buildWrapper({})
    expect(wrapper.attributes('class')).toContain('text-sp-400')
  })

  it('displays color given in props', () => {
    const wrapper = buildWrapper({ classes: 'text-red-600' })
    expect(wrapper.attributes('class')).toContain('text-red-600')
  })
})

import { mount } from '@support/testHelper'
import TractionTableColumn from '@/components/shared/table/TractionTableColumn'
import { describe, expect, it } from 'vitest'

describe('TractionTableColumn', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionTableColumn, {
      props,
      slots: {
        default: 'Column Text',
      },
    })
  }
  it('displays the column text and default classess', () => {
    const wrapper = buildWrapper({})
    expect(wrapper.text()).toContain('Column Text')
    expect(wrapper.find('[data-testid=column]').attributes('class')).toContain(
      'px-1 py-1 text-sm whitespace-nowrap text-center',
    )
  })
  it('sets the given props for the column component', () => {
    const wrapper = buildWrapper({ classes: 'text-lg', colspan: 2 })
    expect(wrapper.find('[data-testid=column]').attributes('class')).toContain('text-lg')
    expect(wrapper.find('[data-testid=column]').attributes('colspan')).toEqual('2')
  })
  it('emits id on click event', () => {
    const wrapper = buildWrapper({ id: 'test-column' })
    wrapper.find('[data-testid=column]').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('click')
    expect(wrapper.emitted('click')[0]).toEqual(['test-column'])
  })
})

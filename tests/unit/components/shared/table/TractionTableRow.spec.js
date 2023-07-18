import { localVue, mount } from '@support/testHelper'
import TractionTableRow from '@/components/shared/table/TractionTableRow'
import { describe, expect, it } from 'vitest'

describe('TractionTableRow', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionTableRow, {
      localVue,
      props: props,
      slots: {
        default: 'Row Text',
      },
    })
  }
  it('displays the row text', () => {
    const wrapper = buildWrapper({})
    expect(wrapper.text()).toContain('Row Text')
  })
  it('sets the given class attributes for the row', () => {
    const wrapper = buildWrapper({ classes: 'text-lg' })
    expect(wrapper.find('[data-testid=row]').attributes('class')).toContain('text-lg')
  })
})

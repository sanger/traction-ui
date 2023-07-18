import { mount } from '@support/testHelper'
import TractionFieldset from '@/components/shared/TractionFieldset.vue'
import { expect } from 'vitest'

describe('TractionFieldset.vue', () => {
  const defaultProps = {
    title: 'A title',
  }
  const fields = [
    {
      label: 'Number of Gigabases required',
      component: 'input',
      attribute: 'gb_req',
      description: 'Some additional text',
      componentProps: {
        type: 'number',
        step: 1,
        minimum: 0,
      },
    },
    {
      label: 'Other attribute',
      component: 'input',
      attribute: 'other',
      componentProps: {
        type: 'text',
      },
    },
  ]
  const buildWrapper = (props = {}) => {
    return mount(TractionFieldset, {
      props: { ...defaultProps, ...props },
      slots: {
        default: 'Section Content',
        bottom: 'Lead out content',
      },
    })
  }

  it('displays the content', () => {
    const wrapper = buildWrapper({})
    expect(wrapper.text()).toContain('Section Content')
  })

  it('displays the bottom content', () => {
    const wrapper = buildWrapper({})
    expect(wrapper.text()).toContain('Lead out content')
  })

  it('displays the title', () => {
    const wrapper = buildWrapper({ title: 'My Field Set' })
    expect(wrapper.text()).toContain('My Field Set')
  })

  it('can render provided fields', () => {
    const wrapper = buildWrapper({ fields })
    expect(wrapper.find('input').exists()).toBeTruthy()
    expect(wrapper.find('label').text()).toContain('Number of Gigabases required')
  })

  it('binds all values', async () => {
    const wrapper = buildWrapper({ fields })
    await wrapper.find('input').setValue('12')
    expect(wrapper.emitted().input).toEqual([[{ gb_req: '12', other: null }]])
  })

  it('sets up sensible default values', () => {
    const wrapper = buildWrapper({ fields })
    expect(wrapper.vm.value).toEqual({ gb_req: null, other: null })
  })

  it('can take defaults', () => {
    const wrapper = buildWrapper({ fields, value: { gb_req: '12', other: 'happy' } })
    expect(wrapper.find('input[type=number]').element.value).toEqual('12')
    expect(wrapper.find('input[type=text]').element.value).toEqual('happy')
  })
})

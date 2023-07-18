import { localVue, mount } from '@support/testHelper'
import TractionFieldGroup from '@/components/shared/TractionFieldGroup.vue'

describe('TractionFieldGroup.vue', () => {
  const defaultProps = {
    label: 'Number of Gigabases required',
    component: 'input',
    attribute: 'gb_req',
    description: 'Some additional text',
    componentProps: {
      type: 'number',
      step: '1',
      min: '0',
    },
  }

  const buildWrapper = (props = {}) => {
    return mount(TractionFieldGroup, {
      localVue,
      props: { ...defaultProps, ...props },
      slots: {
        default: 'Section Content',
      },
    })
  }

  it('displays the content', () => {
    const wrapper = buildWrapper()
    expect(wrapper.text()).toContain('Section Content')
  })

  it('can render provided fields', () => {
    const wrapper = buildWrapper()
    expect(wrapper.find('input').exists()).toBeTruthy()
    expect(wrapper.find('label').text()).toContain('Number of Gigabases required')
  })

  it('binds the value', async () => {
    const wrapper = buildWrapper()
    await wrapper.find('input').setValue('12')
    expect(wrapper.emitted().input).toEqual([['12']])
  })
})

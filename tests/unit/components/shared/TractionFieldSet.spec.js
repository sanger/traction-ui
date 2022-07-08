import { localVue, mount } from '@support/testHelper'
import TractionFieldset from '@/components/shared/TractionFieldset.vue'

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
  ]
  const buildWrapper = (props = {}) => {
    return mount(TractionFieldset, {
      localVue,
      propsData: { ...defaultProps, ...props },
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
})

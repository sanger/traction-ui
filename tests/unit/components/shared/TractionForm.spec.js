import { localVue, mount } from '@support/testHelper'
import TractionForm from '@/components/shared/TractionForm'

describe('TractionForm.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionForm, {
      localVue,
      propsData: props,
      slots: {
        default: 'Section Content',
      },
    })
  }

  it('displays the content', () => {
    const wrapper = buildWrapper({})
    expect(wrapper.text()).toContain('Section Content')
  })
})
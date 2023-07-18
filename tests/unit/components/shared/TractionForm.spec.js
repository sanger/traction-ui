import { localVue, mount } from '@support/testHelper'
import TractionForm from '@/components/shared/TractionForm'

describe('TractionForm.vue', () => {
  const buildWrapper = (props = {}, slot) => {
    return mount(TractionForm, {
      localVue,
      props: props,
      slots: {
        default: slot,
      },
    })
  }

  it('displays the content', () => {
    const wrapper = buildWrapper({}, '<div>Section Content</div>')
    expect(wrapper.text()).toContain('Section Content')
  })

  it('sets the class', () => {
    const wrapper = buildWrapper({ id: 'form', classes: 'flex-row' }, '<div>Section Content</div>')
    expect(wrapper.find('#form').attributes('class')).toContain('flex-row')
  })
  it('displays the slot components', () => {
    const wrapper = buildWrapper({}, '<button id="submit-btn">Submit</button>')
    const button = wrapper.find('#submit-btn')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('Submit')
  })

  it('emits event when submit action is triggered,', async () => {
    const wrapper = buildWrapper({ id: 'form' }, '<div>Section Content</div>')
    await wrapper.find('#form').trigger('submit.prevent')
    expect(wrapper.emitted()).toBeTruthy()
  })
  it('emits event when reset action is triggered,', async () => {
    const wrapper = buildWrapper({ id: 'form' }, '<div>Section Content</div>')
    await wrapper.find('#form').trigger('reset.prevent')
    expect(wrapper.emitted()).toBeTruthy()
  })
})

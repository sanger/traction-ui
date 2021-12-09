import { mount, localVue } from 'testHelper'
import Message from '@/components/Message'

describe('Message.vue', () => {
  let wrapper
  const requiredProps = { message: 'bar' }

  it('has a message', () => {
    wrapper = mount(Message, {
      localVue,
      propsData: { ...requiredProps, message: 'bar' },
    })
    expect(wrapper.vm.message).toBe('bar')
  })

  it('has a type', () => {
    wrapper = mount(Message, {
      localVue,
      propsData: { ...requiredProps, type: 'primary' },
    })
    expect(wrapper.vm.type).toBe('primary')
  })

  it('displays the message', () => {
    wrapper = mount(Message, {
      localVue,
      propsData: { ...requiredProps, message: 'bar' },
    })
    expect(wrapper.html()).toContain('bar')
  })

  it('displays the type', () => {
    wrapper = mount(Message, {
      localVue,
      propsData: { ...requiredProps, type: 'success' },
    })
    expect(wrapper.find('.alert-success').element).toBeTruthy()
  })

  describe('data-attribute', () => {
    it('default', () => {
      const wrapper = mount(Message, { localVue, propsData: requiredProps })
      expect(wrapper.find('[data-type=error-message]').exists()).toBeTruthy()
    })

    it('passed as prop', () => {
      const wrapper = mount(Message, {
        localVue,
        propsData: { ...requiredProps, dataType: 'darkstar' },
      })
      expect(wrapper.find('[data-type=darkstar]').exists()).toBeTruthy()
    })
  })
})

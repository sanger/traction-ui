import { mount } from '@support/testHelper'
import TractionMessage from '@/components/TractionMessage'

describe('TractionMessage.vue', () => {
  let wrapper
  const requiredProps = { message: 'bar' }

  it('has a message', () => {
    wrapper = mount(TractionMessage, {
      props: { ...requiredProps, message: 'bar' },
    })
    expect(wrapper.vm.message).toBe('bar')
  })

  it('has a type', () => {
    wrapper = mount(TractionMessage, {
      props: { ...requiredProps, type: 'primary' },
    })
    expect(wrapper.vm.type).toBe('primary')
  })

  it('displays the message', () => {
    wrapper = mount(TractionMessage, {
      props: { ...requiredProps, message: 'bar' },
    })
    expect(wrapper.find('[data-attribute=message]').element).toBeTruthy()
    expect(wrapper.html()).toContain('bar')
  })
  it('displays the close button', () => {
    wrapper = mount(TractionMessage, {
      props: { ...requiredProps, message: 'bar' },
    })
    expect(wrapper.find('[data-attribute=close]').element).toBeTruthy()
  })

  describe('converts types to html styles', () => {
    it('displays success style', () => {
      wrapper = mount(TractionMessage, {
        props: { ...requiredProps, type: 'success' },
      })
      expect(wrapper.find('[data-attribute=message]').attributes('class')).toContain(
        'success-message',
      )
      expect(wrapper.find('[data-attribute=close-icon]').attributes('class')).toContain(
        'success-icon',
      )
    })

    it('displays error style', () => {
      wrapper = mount(TractionMessage, {
        props: { ...requiredProps, type: 'danger' },
      })
      expect(wrapper.find('[data-attribute=message]').attributes('class')).toContain(
        'failure-message',
      )
      expect(wrapper.find('[data-attribute=close-icon]').attributes('class')).toContain(
        'failure-icon',
      )
    })

    it('displays warning style', () => {
      wrapper = mount(TractionMessage, {
        props: { ...requiredProps, type: 'warning' },
      })
      expect(wrapper.find('[data-attribute=message]').attributes('class')).toContain(
        'warning-message',
      )
      expect(wrapper.find('[data-attribute=close-icon]').attributes('class')).toContain(
        'warning-icon',
      )
    })

    it('emits dismissed event on close button click', () => {
      wrapper = mount(TractionMessage, {
        props: { ...requiredProps, type: 'danger' },
      })
      wrapper.find('[data-attribute=close]').trigger('click')
      expect(wrapper.emitted('dismissed')).toBeTruthy()
    })
  })
})

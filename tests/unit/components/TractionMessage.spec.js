import { mount, localVue } from '@support/testHelper'
import TractionMessage from '@/components/TractionMessage'

describe('TractionMessage.vue', () => {
  let wrapper
  const requiredProps = { message: 'bar' }

  it('has a message', () => {
    wrapper = mount(TractionMessage, {
      localVue,
      props: { ...requiredProps, message: 'bar' },
    })
    expect(wrapper.vm.message).toBe('bar')
  })

  it('has a type', () => {
    wrapper = mount(TractionMessage, {
      localVue,
      props: { ...requiredProps, type: 'primary' },
    })
    expect(wrapper.vm.type).toBe('primary')
  })

  it('displays the message', () => {
    wrapper = mount(TractionMessage, {
      localVue,
      props: { ...requiredProps, message: 'bar' },
    })
    expect(wrapper.find('[data-attribute=message]').element).toBeTruthy()
    expect(wrapper.html()).toContain('bar')
  })
  it('displays the close button', () => {
    wrapper = mount(TractionMessage, {
      localVue,
      props: { ...requiredProps, message: 'bar' },
    })
    expect(wrapper.find('[data-attribute=close]').element).toBeTruthy()
  })

  describe('converts types to html styles', () => {
    it('displays success style', () => {
      wrapper = mount(TractionMessage, {
        localVue,
        props: { ...requiredProps, type: 'success' },
      })
      expect(wrapper.find('[data-attribute=message]').attributes('class')).toContain(
        'bg-green-100 text-green-70',
      )
      expect(wrapper.find('[data-attribute=close-icon]').attributes('class')).toContain(
        'text-green-400 hover:text-green-700',
      )
    })

    it('displays error style', () => {
      wrapper = mount(TractionMessage, {
        localVue,
        props: { ...requiredProps, type: 'error' },
      })
      expect(wrapper.find('[data-attribute=message]').attributes('class')).toContain(
        'bg-red-200 text-red-600',
      )
      expect(wrapper.find('[data-attribute=close-icon]').attributes('class')).toContain(
        'text-red-400 hover:text-red-600',
      )
    })
    it('emits dismissed event on close button click', () => {
      wrapper = mount(TractionMessage, {
        localVue,
        props: { ...requiredProps, type: 'error' },
      })
      wrapper.find('[data-attribute=close]').trigger('click')
      expect(wrapper.emitted('dismissed')).toBeTruthy()
    })
  })
})

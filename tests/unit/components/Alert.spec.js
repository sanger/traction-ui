import { mount, localVue } from 'testHelper'
import Alert from '@/components/Alert'

describe('Alert.vue', () => {
  let wrapper

  it('has a message', () => {
    wrapper = mount(Alert, {
      localVue,
      data() {
        return { message: 'bar' }
      },
    })
    expect(wrapper.vm.message).toBe('bar')
  })

  it('has a type', () => {
    wrapper = mount(Alert, {
      localVue,
      data() {
        return { type: 'primary' }
      },
    })
    expect(wrapper.vm.type).toBe('primary')
  })

  it('is hidden as default', () => {
    wrapper = mount(Alert, { localVue })
    expect(wrapper.vm.showDismissibleAlert).toBeFalsy()
    expect(wrapper.find('#showAlert').element).toBeTruthy()
  })

  it('displays the message', () => {
    wrapper = mount(Alert, {
      localVue,
      data() {
        return { message: 'bar', showDismissibleAlert: true }
      },
    })
    expect(wrapper.html()).toContain('bar')
  })

  it('displays the type', () => {
    wrapper = mount(Alert, {
      localVue,
      data() {
        return { type: 'success', showDismissibleAlert: true }
      },
    })
    expect(wrapper.find('.alert-success').element).toBeTruthy()
  })

  it('#show sets the data', () => {
    let alert = mount(Alert, { localVue }).vm
    alert.show('msg', 'primary')
    expect(alert.message).toBe('msg')
    expect(alert.type).toBe('primary')
  })
})

import { mount, localVue } from '../testHelper'
import Alert from '@/components/Alert'

describe('Alert.vue', () => {

  let wrapper, alert

  beforeEach(() => {
    wrapper = mount(Alert, { mocks: localVue })
    alert = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Alert')
  })

  it('will have an alert component', () => {
    expect(wrapper.contains('.alert')).toBe(true)
  })

  it('has a message', () => {
    wrapper.setData({ message: 'bar' })
    expect(wrapper.vm.message).toBe('bar')
  })

  it('has a type', () => {
    wrapper.setData({ type: 'primary' })
    expect(wrapper.vm.type).toBe('primary')
  })

  it('is hidden as default', () => {
    expect(wrapper.vm.showDismissibleAlert).toBe(false)
    expect(wrapper.contains('#showAlert')).toBe(false)
  })

  it('displays the message', () => {
    wrapper.setData({ message: 'bar', showDismissibleAlert: true })
    expect(wrapper.html()).toContain('bar')
  })

  it('displays the type', () => {
    wrapper.setData({ type: 'success', showDismissibleAlert: true })
    expect(wrapper.contains('.alert-success')).toBe(true)
  })

  it('#show sets the data', () => {
    alert.show('msg', 'primary')
    expect(alert.message).toBe('msg')
    expect(alert.type).toBe('primary')
  })

})

import { mount, localVue } from '../testHelper'
import Modal from '@/components/Modal'

describe('Modal.vue', () => {

  let wrapper, alert

  beforeEach(() => {
    wrapper = mount(Modal, { mocks: localVue })
    alert = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Modal')
  })

})

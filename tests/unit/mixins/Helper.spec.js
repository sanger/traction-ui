import Helper from '@/mixins/Helper'
import { localVue, mount } from 'testHelper'

// TODO: added tests as a mimimum but these functions
// should be available anywhere not via a mixin
describe('Helper', () => {
  let helper, wrapper

  beforeEach(() => {
    wrapper = mount(Helper, {
      localVue,
      template: '<div />',
      render() {},
    })

    helper = wrapper.vm
  })

  it('#capitalizeFirstLetter', () => {
    expect(helper.capitalizeFirstLetter('hello')).toEqual('Hello')
    expect(helper.capitalizeFirstLetter('is it me youre looking for')).toEqual(
      'Is it me youre looking for',
    )
  })

  it('#humanise', () => {
    expect(helper.humanise('hello')).toEqual('Hello')
    expect(helper.humanise('is-it-me-youre-looking-for')).toEqual('Is it me youre looking for')
  })
})

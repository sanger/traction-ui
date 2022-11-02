import { localVue, mount } from '@support/testHelper'

import TractionInput from '@/components/shared/TractionInput'

describe('"TractionInput.vue"', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionInput, {
      localVue,
      propsData: props,
    })
  }

  it('displays the label and text box', () => {
    const wrapper = buildWrapper({ title: 'Label Text' })
    expect(wrapper.text()).toContain('Label Text')
    expect(wrapper.find('input').exists()).toBeTruthy()
  })

  it('displays the placeholder text', () => {
    const wrapper = buildWrapper({ placeholder: 'Place holder' })
    expect(wrapper.find('input').element.placeholder).toEqual('Place holder')
  })

  it('sets default value for type string', () => {
    const wrapper = buildWrapper({ type: 'text', value: 'test' })
    expect(wrapper.find('input[type=text]').element.value).toEqual('test')
  })

  it('sets default value for type number', () => {
    const wrapper = buildWrapper({ type: 'number', value: 10 })
    expect(wrapper.find('input[type=number]').element.value).toEqual('10')
  })

  it('emits the value', async () => {
    const wrapper = buildWrapper({ type: 'number' })
    await wrapper.find('input').setValue('10000')
    expect(wrapper.emitted().input).toEqual([['10000']])
  })

  it('sets min,max with given value for type number', () => {
    const wrapper = buildWrapper({ type: 'number', value: 10, min: 4, max: 10 })
    expect(wrapper.find('input[type=number]').element.min).toEqual('4')
    expect(wrapper.find('input[type=number]').element.max).toEqual('10')
  })

  it('updates the v-model value when changing the input value, ', () => {
    var comp = mount({
      template: '<traction-input v-model="test"></traction-input>',
      components: { 'traction-input': TractionInput },
      data: {
        test: '',
      },
    })
    const textInput = comp.find('input')
    textInput.element.value = 'Test value'
    textInput.trigger('input')
    expect(comp.vm.test).toBe('Test value')
  })

  it('updates the input when changing the v-model value externally,', async () => {
    var wrapper = mount({
      template: '<traction-input :value="test"></traction-input>',
      components: { 'traction-input': TractionInput },
      data() {
        return { test: '' }
      },
    })
    const textInput = wrapper.find('input')
    expect(textInput.element.value).toBe('')
    await wrapper.setData({ test: 'New Test value' })
    expect(textInput.element.value).toBe('New Test value')
  })
})

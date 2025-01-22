import { mount } from '@support/testHelper'

import TractionInput from '@/components/shared/TractionInput'

describe('TractionInput.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionInput, {
      props,
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
    const wrapper = buildWrapper({ type: 'text', modelValue: 'test' })
    expect(wrapper.find('input[type=text]').element.value).toEqual('test')
  })

  it('sets default value for type number', () => {
    const wrapper = buildWrapper({ type: 'number', modelValue: 10 })
    expect(wrapper.find('input[type=number]').element.value).toEqual('10')
  })

  it('sets default value for type password', () => {
    const wrapper = buildWrapper({ type: 'password', modelValue: 'secret' })
    expect(wrapper.find('input[type=password]').element.value).toEqual('secret')
  })

  it('emits the value for type password', async () => {
    const wrapper = buildWrapper({ type: 'password' })
    await wrapper.find('input').setValue('newsecret')
    expect(wrapper.emitted('update:modelValue')).toEqual([['newsecret']])
  })

  it('emits the value', async () => {
    const wrapper = buildWrapper({ type: 'number' })
    await wrapper.find('input').setValue('10000')
    expect(wrapper.emitted('update:modelValue')).toEqual([['10000']])
  })

  it('sets min,max with given value for type number', () => {
    const wrapper = buildWrapper({ type: 'number', modelValue: 10, min: 4, max: 10 })
    expect(wrapper.find('input[type=number]').element.min).toEqual('4')
    expect(wrapper.find('input[type=number]').element.max).toEqual('10')
  })

  it('updates the v-model value when changing the input value, ', () => {
    var comp = mount({
      template: '<traction-input v-model="test"></traction-input>',
      components: { 'traction-input': TractionInput },
      data() {
        return {
          test: '',
        }
      },
    })
    const textInput = comp.find('input')
    textInput.element.value = 'Test value'
    textInput.trigger('input')
    expect(comp.vm.test).toBe('Test value')
  })

  it('updates the input when changing the v-model value externally,', async () => {
    var wrapper = mount({
      template: '<traction-input :model-value="test"></traction-input>',
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
  it('displays formatted text,', async () => {
    var wrapper = mount({
      template: '<traction-input :model-value="test" :formatter="formatText"></traction-input>',
      components: { 'traction-input': TractionInput },
      data() {
        return { test: 'Test' }
      },
      methods: {
        formatText(val) {
          return val + '_formatted'
        },
      },
    })
    const textInput = wrapper.find('input')
    expect(textInput.element.value).toBe('Test_formatted')
    await wrapper.setData({ test: 'New Test' })
    expect(textInput.element.value).toBe('New Test_formatted')
  })
})

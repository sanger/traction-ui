import { localVue, mount } from '@support/testHelper'

import TractionSelect from '@/components/shared/TractionSelect'
import { describe, expect, it } from 'vitest'

describe('TractionSelect.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionSelect, {
      localVue,
      propsData: props,
    })
  }

  it('displays the label and select box', () => {
    const wrapper = buildWrapper({ label: 'Label Text' })
    expect(wrapper.text()).toContain('Label Text')
    expect(wrapper.find('select').exists()).toBeTruthy()
  })

  it('displays the placeholder', () => {
    const wrapper = buildWrapper({ label: 'Label Text', placeholder: 'Testing' })
    const options = wrapper.find('select').findAll('option')
    //Option displayed as disabled
    expect(options.at(0).element.text).toEqual('Testing')
    expect(wrapper.find('option:disabled').element.text).toBe('Testing')
  })

  describe('Testing different value types for options', () => {
    it('sets options for string value array ', () => {
      const wrapper = buildWrapper({ options: ['Option 1', 'Option 2', 'Option 3'] })
      expect(wrapper.find('select').element.options.length).toEqual(3)
    })
    it('sets options given an array of objects with text and value', () => {
      const wrapper = buildWrapper({
        options: [
          { text: 'Option 1', value: 1 },
          { text: 'Option 2', value: 2 },
          { text: 'Option 3', value: 3 },
        ],
      })
      expect(wrapper.find('select').element.options.length).toEqual(3)
    })
    it('sets options given an array of objects with text', () => {
      const wrapper = buildWrapper({
        options: [{ text: 'Option 1' }, { text: 'Option 2' }, { text: 'Option 3' }],
      })
      expect(wrapper.find('select').element.options.length).toEqual(3)
    })
    it('sets options given an array of objects with values', () => {
      const wrapper = buildWrapper({
        options: [{ value: 'Option 1' }, { value: 'Option 2' }, { value: 'Option 3' }],
      })
      expect(wrapper.find('select').element.options.length).toEqual(3)
    })

    it('supports disabled field', () => {
      const wrapper = buildWrapper({
        options: [
          { value: 'Option 1', text: 'Option 1', disabled: true },
          { value: 'Option 2', text: 'Option 2', disabled: false },
        ],
      })
      //Option displayed as disabled
      const options = wrapper.find('select').findAll('option')
      expect(options.at(0).element.text).toEqual('Option 1')
      expect(wrapper.find('option:disabled').element.text).toBe('Option 1')
      expect(wrapper.find('option:enabled').element.text).toBe('Option 2')
    })
    it('supports value field as null which will be disabled by default(to allow compatibility with bootstrap component', () => {
      const wrapper = buildWrapper({
        options: [
          { value: null, text: 'Option 1' },
          { value: 'Option 2', text: 'Option 2' },
        ],
      })
      //Option displayed as disabled
      const options = wrapper.find('select').findAll('option')
      expect(options.at(0).element.text).toEqual('Option 1')
       expect(wrapper.find('option:disabled').element.text).toBe('Option 1')
      //expect(wrapper.find('option:disabled').element.text).toBe('Option 1')
    })
  })

  it('sets default value for type string', () => {
    const wrapper = buildWrapper({
      options: ['Option 1', 'Option 2', 'Option 3'],
      value: 'Option 2',
    })
    expect(wrapper.find('select').element.value).toEqual('Option 2')
  })
  it('will not set default value for type string if give a value not in option', () => {
    const wrapper = buildWrapper({
      options: ['Option 1', 'Option 2', 'Option 3'],
      value: 'Option 5',
    })
    expect(wrapper.find('select').element.value).toEqual('')
  })

  it('sets selected value for select', async () => {
    const wrapper = buildWrapper({ options: ['Option 1', 'Option 2', 'Option 3'] })
    const options = wrapper.find('select').findAll('option')
    await options.at(1).setSelected()
    expect(wrapper.find('option:checked').element.value).toBe('Option 2')
    expect(wrapper.find('select').element.value).toEqual('Option 2')
  })

  it('updates the v-model value when changing the selected value, ', async () => {
    const wrapper = mount({
      template: '<traction-select v-model="test" :options="optionData" ></traction-select>',
      components: { 'traction-select': TractionSelect },
      data() {
        return {
          test: '',
          optionData: ['Option 1', 'Option 2', 'Option 3'],
        }
      },
    })
    const options = wrapper.find('select').findAll('option')
    await options.at(1).setSelected()
    expect(wrapper.vm.test).toBe('Option 2')
  })

  it('updates the selected value when changing the v-model value externally,', async () => {
    var wrapper = mount({
      template: '<traction-select :value="test" :options="optionData"></traction-select>',
      components: { 'traction-select': TractionSelect },
      data() {
        return { test: '', optionData: ['Option 1', 'Option 2', 'Option 3'] }
      },
    })
    const select = wrapper.find('select')
    expect(select.element.value).toBe('')
    await wrapper.setData({ test: 'Option 3' })
    expect(select.element.value).toBe('Option 3')
  })
  it('invokes call back when select changes value,', async () => {
    var wrapper = mount({
      template:
        '<traction-select :value="test" :options="optionData" @input="setTest"></traction-select>',
      components: { 'traction-select': TractionSelect },
      data() {
        return { test: '', dummyTest: '', optionData: ['Option 1', 'Option 2', 'Option 3'] }
      },
      methods: {
        setTest(value) {
          this.dummyTest = value
        },
      },
    })
    const options = wrapper.find('select').findAll('option')
    await options.at(1).setSelected()
    expect(wrapper.vm.dummyTest).toEqual('Option 2')
  })
})

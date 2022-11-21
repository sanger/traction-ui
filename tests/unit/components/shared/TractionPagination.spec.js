import { localVue, mount } from '@support/testHelper'

import TractionPagination from '@/components/shared/TractionPagination'
import { describe, expect, it } from 'vitest'

describe('TractionPagination.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionPagination, {
      localVue,
      propsData: props,
    })
  }

  describe('when pages are more than buttons on display', () => {
    const wrapper = buildWrapper({ totalRows: '100', perPage: '10', maxVisibleButtons: 5 })
    it('displays the asked number of buttons to show pages', () => {
      expect(wrapper.findAll('[data-testid=page-button]').length).toEqual(5)
    })
    it('displays the first page button as selected', () => {
      expect(wrapper.findAll('[data-testid=page-button]').at(0).attributes('class')).toContain(
        'text-white bg-sdb-200 shadow-sm focus:shadow-outline-sdb hover:bg-sdb-300 active:bg-sdb-400',
      )
    })
    it('disables the first navigation button', () => {
      expect(wrapper.find('[data-testid=first-button]').element.disabled).toBe(true)
    })
    it('disables the prev navigation button as disabled', () => {
      expect(wrapper.find('[data-testid=prev-button]').element.disabled).toBe(true)
    })
    it('enables the last navigation button as disabled', () => {
      expect(wrapper.find('[data-testid=last-button]').element.disabled).toBe(false)
    })
    it('enables the prev navigation button as disabled', () => {
      expect(wrapper.find('[data-testid=next-button]').element.disabled).toBe(false)
    })
  })
  describe('when pages are less than buttons on display', () => {
    const wrapper = buildWrapper({ totalRows: '10', perPage: '10', maxVisibleButtons: 5 })
    it('displays only the buttons required to display pages if less than asked', () => {
      expect(wrapper.findAll('[data-testid=page-button]').length).toEqual(1)
    })
    it('disables the first navigation button', () => {
      expect(wrapper.find('[data-testid=first-button]').element.disabled).toBe(true)
    })
    it('disables the prev navigation button as disabled', () => {
      expect(wrapper.find('[data-testid=prev-button]').element.disabled).toBe(true)
    })
    it('disbles the last navigation button as disabled', () => {
      expect(wrapper.find('[data-testid=last-button]').element.disabled).toBe(true)
    })
    it('disables the prev navigation button as disabled', () => {
      expect(wrapper.find('[data-testid=next-button]').element.disabled).toBe(true)
    })
  })

  /* it('displays the placeholder text', () => {
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
  })*/
})

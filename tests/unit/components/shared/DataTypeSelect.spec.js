import DataTypeSelect from '@/components/shared/DataTypeSelect'
import { mount, store } from '@support/testHelper'
import { vi } from 'vitest'

describe('DataTypeSelect.vue', () => {
  const buildWrapper = (props = { pipeline: 'ont' }) => {
    return mount(DataTypeSelect, {
      store,
      props,
    })
  }

  vi.mock('swrv')

  const findOption = (optionText, { from }) =>
    from.findAll('option').find((option) => option.text() == optionText)

  describe('dataType', () => {
    it('lists the expected options', () => {
      const wrapper = buildWrapper()
      const select = wrapper.find('select')
      expect(findOption('basecalls and raw data', { from: select })).toBeTruthy()
    })

    it('will not list data types from other pipelines', () => {
      const wrapper = buildWrapper({ pipeline: 'ont' })
      const select = wrapper.find('select')
      expect(findOption('basecalls and raw data', { from: select })).toBeTruthy()
      expect(findOption('dummy type', { from: select })).toBeFalsy()
    })

    it('will list data types from all pipelines unless specified', () => {
      const wrapper = buildWrapper({})
      const select = wrapper.find('select')
      expect(findOption('basecalls and raw data', { from: select })).toBeTruthy()
      expect(findOption('dummy type', { from: select })).toBeTruthy()
    })

    it('can emit a data type', async () => {
      const wrapper = buildWrapper()
      const select = wrapper.find('select')
      await findOption('basecalls and raw data', { from: select }).setSelected()
      expect(wrapper.emitted('input')).toEqual([['basecalls and raw data']])
    })
  })
})

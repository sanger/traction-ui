import LibraryTypeSelect from '@/components/shared/LibraryTypeSelect'
import { mount, store } from '@support/testHelper'

describe('LibraryTypeSelect.vue', () => {
  const buildWrapper = (props = { pipeline: 'pacbio' }) => {
    return mount(LibraryTypeSelect, {
      store,
      props,
    })
  }

  const findOption = (optionText, { from }) =>
    from.findAll('option').find((option) => option.text() == optionText)

  describe('libraryType', () => {
    it('lists the expected options', () => {
      const wrapper = buildWrapper()
      const select = wrapper.find('select')
      expect(findOption('Pacbio_HiFi', { from: select }).exists()).toBe(true)
      expect(findOption('Pacbio_IsoSeq', { from: select }).exists()).toBe(true)
      expect(findOption('None', { from: select }).exists()).toBe(true)
      expect(
        findOption('Import from Sequencescape (where available)', { from: select }).exists(),
      ).toBe(true)
    })

    it('will not list library types from other pipelines', () => {
      const wrapper = buildWrapper({ pipeline: 'pacbio' })
      const select = wrapper.find('select')
      expect(findOption('Pacbio_HiFi', { from: select }).exists()).toBe(true)
      expect(findOption('ONT_GridIon', { from: select })).toBe(undefined)
    })

    it('will list library types from all pipelines unless specified', () => {
      const wrapper = buildWrapper({})
      const select = wrapper.find('select')
      expect(findOption('Pacbio_HiFi', { from: select }).exists()).toBe(true)
      expect(findOption('ONT_GridIon', { from: select }).exists()).toBe(true)
    })

    it('can emit a library type', async () => {
      const wrapper = buildWrapper()
      const select = wrapper.find('select')
      await findOption('Pacbio_HiFi', { from: select }).setSelected()
      expect(wrapper.emitted('update:modelValue')).toEqual([['Pacbio_HiFi']])
    })

    it('can emit no library type', async () => {
      const wrapper = buildWrapper()
      const select = wrapper.find('select')
      await findOption('None', { from: select }).setSelected()
      expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
    })

    it('can have no library type disabled', async () => {
      const wrapper = buildWrapper({ pipeline: 'pacbio', allowNone: false })
      const select = wrapper.find('select')
      expect(findOption('None', { from: select })).toBe(undefined)
    })

    it('can emit undefined library type', async () => {
      const wrapper = buildWrapper({ pipeline: 'pacbio', modelValue: 'Pacbio_HiFi' })
      const select = wrapper.find('select')
      await findOption('Import from Sequencescape (where available)', {
        from: select,
      }).setSelected()
      expect(wrapper.emitted('update:modelValue')).toEqual([[undefined]])
    })

    it('only shows the import option when enabled', () => {
      const wrapper = buildWrapper({ pipeline: 'pacbio', import: false })
      const select = wrapper.find('select')

      expect(findOption('Import from Sequencescape (where available)', { from: select })).toBe(
        undefined,
      )
    })
  })
})

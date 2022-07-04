import LibraryTypeSelect from '@/components/shared/LibraryTypeSelect'
import { localVue, mount, store } from '@support/testHelper'

describe('LibraryTypeSelect.vue', () => {
  const buildWrapper = (props = { pipeline: 'pacbio' }) => {
    return mount(LibraryTypeSelect, {
      localVue,
      store,
      propsData: props,
    })
  }

  const findOption = (optionText, { from }) =>
    from.findAll('option').wrappers.find((option) => option.text() == optionText)

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

    it('can emit a library type', async () => {
      const wrapper = buildWrapper()
      const select = wrapper.find('select')
      await findOption('Pacbio_HiFi', { from: select }).setSelected()
      expect(wrapper.emitted('input')).toEqual([['Pacbio_HiFi']])
    })

    it('can emit no library type', async () => {
      const wrapper = buildWrapper()
      const select = wrapper.find('select')
      await findOption('None', { from: select }).setSelected()
      expect(wrapper.emitted('input')).toEqual([[null]])
    })

    it('can emit undefined library type', async () => {
      const wrapper = buildWrapper({ pipeline: 'pacbio', value: 'Pacbio_HiFi' })
      const select = wrapper.find('select')
      await findOption('Import from Sequencescape (where available)', {
        from: select,
      }).setSelected()
      expect(wrapper.emitted('input')).toEqual([[undefined]])
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

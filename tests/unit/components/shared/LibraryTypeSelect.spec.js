import LibraryTypeSelect from '@/components/shared/LibraryTypeSelect.vue'
import { findOption } from '@support/testHelper.js'
import { mountWithStore } from '@tests/support/testHelper.js'
import useRootStore from '@/stores/index.js'
import LibraryTypeFactory from '@tests/factories/LibraryTypeFactory.js'

const libraryTypeFactory = LibraryTypeFactory()

const mountComponent = (props = {}) => {
  return mountWithStore(LibraryTypeSelect, {
    initialState: {
      root: { libraryTypes: libraryTypeFactory.storeData },
    },
    props,
    createStore: () => useRootStore(),
  })
}

describe('LibraryTypeSelect.vue', () => {
  describe('libraryType', () => {
    it('lists the expected options', () => {
      const { wrapper } = mountComponent()

      const select = wrapper.find('select')
      expect(findOption('Pacbio_HiFi', { from: select }).exists()).toBe(true)
      expect(findOption('Pacbio_IsoSeq', { from: select }).exists()).toBe(true)
      expect(findOption('None', { from: select }).exists()).toBe(true)
      expect(
        findOption('Import from Sequencescape (where available)', { from: select }).exists(),
      ).toBe(true)
    })

    it('will not list library types from other pipelines', () => {
      const { wrapper } = mountComponent({ pipeline: 'pacbio' })
      const select = wrapper.find('select')
      expect(findOption('Pacbio_HiFi', { from: select }).exists()).toBe(true)
      expect(findOption('ONT_GridIon', { from: select })).toBe(undefined)
    })

    it('will list library types from all pipelines unless specified', () => {
      const { wrapper } = mountComponent()
      const select = wrapper.find('select')
      expect(findOption('Pacbio_HiFi', { from: select }).exists()).toBe(true)
      expect(findOption('ONT_GridIon', { from: select }).exists()).toBe(true)
    })

    it('can emit a library type', async () => {
      const { wrapper } = mountComponent()
      const select = wrapper.find('select')
      await findOption('Pacbio_HiFi', { from: select }).setSelected()
      expect(wrapper.emitted('update:modelValue')).toEqual([['Pacbio_HiFi']])
    })

    it('can emit no library type', async () => {
      const { wrapper } = await mountComponent()
      const select = wrapper.find('select')
      await findOption('None', { from: select }).setSelected()
      expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
    })

    it('can have no library type disabled', () => {
      const { wrapper } = mountComponent({ pipeline: 'pacbio', allowNone: false })
      const select = wrapper.find('select')
      expect(findOption('None', { from: select })).toBe(undefined)
    })

    it('can emit undefined library type', async () => {
      const { wrapper } = await mountComponent({ pipeline: 'pacbio', modelValue: 'Pacbio_HiFi' })
      const select = wrapper.find('select')
      await findOption('Import from Sequencescape (where available)', {
        from: select,
      }).setSelected()
      expect(wrapper.emitted('update:modelValue')).toEqual([[undefined]])
    })

    it('only shows the import option when enabled', () => {
      const { wrapper } = mountComponent({ pipeline: 'pacbio', import: false })
      const select = wrapper.find('select')

      expect(findOption('Import from Sequencescape (where available)', { from: select })).toBe(
        undefined,
      )
    })
  })
})

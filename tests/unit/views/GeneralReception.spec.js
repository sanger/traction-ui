import { mount, store, nextTick } from '@support/testHelper'
import GeneralReception from '@/views/GeneralReception.vue'
import * as Reception from '@/services/traction/Reception'
import Receptions from '@/lib/receptions'
import { expect, it } from 'vitest'

const tractionReceptionsCreate = store.getters.api.traction.receptions.create

describe('GeneralReception', () => {
  const buildWrapper = (props = { receptions: Receptions }) => {
    return mount(GeneralReception, {
      props,
      store,
    })
  }

  it('generates a wrapper', () => {
    const wrapper = buildWrapper()
    expect(wrapper).toBeTruthy()
  })

  it('has a source selector', () => {
    const wrapper = buildWrapper()

    expect(wrapper.find('[data-type=source-list]').findAll('option')[0].text()).toBe(
      'Sequencescape',
    )
    expect(wrapper.find('[data-type=source-list]').findAll('option')[1].text()).toBe(
      'Samples Extraction',
    )
    // It defaults to Sequencescape
    expect(wrapper.find('[data-type=source-list]').element.value).toEqual('Sequencescape')
  })

  it('has a pipeline selector', () => {
    const wrapper = buildWrapper()
    expect(wrapper.find('[data-type=pipeline-list]').findAll('option')[0].text()).toBe('PacBio')
    expect(wrapper.find('[data-type=pipeline-list]').findAll('option')[1].text()).toBe('ONT')
    // It defaults to PacBio
    expect(wrapper.find('[data-type=pipeline-list]').element.value).toEqual('PacBio')
  })

  describe('request options', () => {
    it('has the a cost code input field', () => {
      const wrapper = buildWrapper()
      expect(wrapper.find('[data-attribute=cost-code-input]')).toBeTruthy()
    })

    it('shows ONT options when ONT is selected', async () => {
      const wrapper = buildWrapper()
      await wrapper.setData({ pipeline: 'ONT' })

      // Library type
      const libraryType = wrapper.find('[data-attribute=library-type-list]')
      expect(libraryType.find('option[value="ONT_GridIon"]').exists()).toBe(true)
      expect(libraryType.find('option[value="_undefined"]').exists()).toBe(true)
      // It should not have any ONT options when Pacbio is the selected pipeline
      expect(libraryType.find('option[value="Pacbio_HiFi"]').exists()).toBe(false)

      expect(wrapper.find('[data-attribute=data-type-list]')).toBeTruthy()
      expect(wrapper.find('[data-attribute=number-of-flowcells-input]')).toBeTruthy()
      // Does not show PacBio options
      expect(wrapper.find('[data-attribute=smrt-cells-input]').exists()).toBe(false)
      expect(wrapper.find('[data-attribute=estimate_of_gb_required]').exists()).toBe(false)
    })

    it('shows PacBio options when PacBio is selected', async () => {
      const wrapper = buildWrapper()
      await wrapper.setData({ pipeline: 'PacBio' })

      // Library type
      const libraryType = wrapper.find('[data-attribute=library-type-list]')
      expect(libraryType.find('option[value="Pacbio_HiFi"]').exists()).toBe(true)
      expect(libraryType.find('option[value="Pacbio_IsoSeq"]').exists()).toBe(true)
      expect(libraryType.find('option[value="_undefined"]').exists()).toBe(true)
      // It should not have any ONT options when Pacbio is the selected pipeline
      expect(libraryType.find('option[value="ONT_GridIon"]').exists()).toBe(false)

      expect(wrapper.find('[data-attribute=smrt-cells-input]')).toBeTruthy()
      expect(wrapper.find('[data-attribute=estimate_of_gb_required]')).toBeTruthy()
      // Does not show ONT options
      expect(wrapper.find('[data-attribute=data-type-list]').exists()).toBe(false)
      expect(wrapper.find('[data-attribute=number-of-flowcells-input]').exists()).toBe(false)
    })
  })

  describe('barcode text area', () => {
    it('single barcode', async () => {
      const wrapper = buildWrapper()
      await wrapper.find('#barcodes').setValue('DN1\n')
      expect(wrapper.vm.barcodes).toEqual('DN1\n')
      expect(wrapper.find('#importText').text()).toEqual(
        'Import 1 labware into PacBio from Sequencescape',
      )
    })
    it('multiple barcodes', async () => {
      const wrapper = buildWrapper()
      await wrapper.find('#barcodes').setValue('DN1\nDN2\nDN3\nDN4\nDN5')
      expect(wrapper.vm.barcodes).toEqual('DN1\nDN2\nDN3\nDN4\nDN5')
      expect(wrapper.find('#importText').text()).toEqual(
        'Import 5 labware into PacBio from Sequencescape',
      )
    })
  })

  it('has a summary area', () => {
    const wrapper = buildWrapper()
    expect(wrapper.text()).toContain('Summary')
    expect(wrapper.find('#importText').text()).toEqual(
      'Import 0 labware into PacBio from Sequencescape',
    )
    expect(wrapper.find('[data-action=reset-form]').text()).toEqual('Reset')
    expect(wrapper.find('[data-action=import-labware]').text()).toEqual('Import')
  })

  it('handles a failed import - load', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = buildWrapper()
    // We've begun the import
    await wrapper.vm.importStarted({ message: 'Starting import' })
    // But it fails
    await wrapper.vm.importFailed({ message: 'Failed import' })

    expect(wrapper.text()).not.toContain('Starting import')
    expect(Object.values(store.state.traction.messages)).toContainEqual({
      type: 'danger',
      message: 'Failed import',
    })
  })

  it('handles a successful import', async () => {
    store.state.traction.messages = []
    const mockedcreateReception = vi
      .spyOn(Reception, 'createReceptionResource')
      .mockImplementation(() => {})
    const wrapper = buildWrapper()
    // We've begun the import
    await wrapper.vm.importStarted({ message: 'Starting import' })

    const foundBarcodes = new Set(['NT1'])
    const attributes = { source: 'traction-ui.sequencescape', request_attributes: [{}] }

    await wrapper.vm.importLoaded({ foundBarcodes, attributes })

    await mockedcreateReception
    expect(wrapper.text()).not.toContain('Starting import')
    expect(mockedcreateReception).toBeCalledWith(tractionReceptionsCreate, foundBarcodes, attributes)

    expect(Object.values(store.state.traction.messages)).toContainEqual({
      type: 'success',
      message: 'Imported 1 labware(s) from Sequencescape',
    })
  })

  it('handles a failed import - save', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    store.state.traction.messages = []
    const message = 'The princess is in another castle'

    vi.spyOn(Reception, 'createReceptionResource').mockRejectedValue(new Error(message))
    const wrapper = buildWrapper()
    // We've begun the import
    await wrapper.vm.importStarted({ message: 'Starting import' })

    await wrapper.vm.importLoaded({ foundBarcodes: new Set([]), attributes: {} })

    expect(wrapper.text()).not.toContain('Starting import')

    await nextTick()

    expect(Object.values(store.state.traction.messages)).toContainEqual({
      type: 'danger',
      message: `Error: ${message}`,
    })
  })
})

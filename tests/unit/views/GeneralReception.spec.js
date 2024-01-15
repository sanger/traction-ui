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
    expect(wrapper.find('[data-type=source-list]').findAll('option')[2].text()).toBe(
      'Sequencescape Tubes',
    )
    // It defaults to Sequencescape
    expect(wrapper.find('[data-type=source-list]').element.value).toEqual('Sequencescape')
  })

  it('shows print options for only for Sequencescape Tubes', async () => {
    const wrapper = buildWrapper()
    const options = wrapper.find('[data-type=source-list]').findAll('option')
    // It should show print options only when Sequencescape Tubes is the selected source
    await options[2].setSelected()
    expect(wrapper.find('[id=print]').exists()).toBe(true)
    // It should not show print options when Sequencescape or Samples Extraction is the selected source
    await options[0].setSelected()
    expect(wrapper.find('[id=print]').exists()).toBe(false)
    await options[1].setSelected()
    expect(wrapper.find('[id=print]').exists()).toBe(false)
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
    describe('single barcode', () => {
      it('should not update importText until barcode is fetched', async () => {
        const wrapper = buildWrapper()
        await wrapper.find('#barcodes').setValue('DN1\n')
        expect(wrapper.vm.barcodes).toEqual('DN1\n')
        expect(wrapper.find('#importText').text()).toEqual(
          'Import 0 labware into PacBio from Sequencescape',
        )
      })
      it('should update importText when fetch function is called', async () => {
        const wrapper = buildWrapper()
        await wrapper.find('#barcodes').setValue('DN1\n')
        const mockedFetchFunction = vi
          .fn()
          .mockResolvedValue({ foundBarcodes: new Set(['DN1']), attributes: {} })
        wrapper.vm.reception.fetchFunction = mockedFetchFunction
        await wrapper.vm.fetchLabware()
        expect(mockedFetchFunction).toBeCalled()
        expect(wrapper.vm.labwareData.foundBarcodes).toEqual(new Set(['DN1']))
        expect(wrapper.find('#importText').text()).toEqual(
          'Import 1 labware into PacBio from Sequencescape',
        )
      })
    })

    describe('multiple barcodes', () => {
      it('when fetch function is called with multiple barcode', async () => {
        const wrapper = buildWrapper()
        await wrapper.find('#barcodes').setValue('DN1\n,DN2\n,DN3\n,DN4\n,DN5\n')
        const foundBarcodes = new Set(['DN1', 'DN2', 'DN3', 'DN4', 'DN5'])
        const mockedFetchFunction = vi.fn().mockResolvedValue({
          foundBarcodes,
          attributes: {},
        })
        wrapper.vm.reception.fetchFunction = mockedFetchFunction
        await wrapper.vm.fetchLabware()
        expect(mockedFetchFunction).toBeCalled()
        expect(wrapper.vm.labwareData.foundBarcodes).toEqual(foundBarcodes)
        expect(wrapper.find('#importText').text()).toEqual(
          'Import 5 labware into PacBio from Sequencescape',
        )
      })
    })
  })
  describe('print area', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = buildWrapper()
      const options = wrapper.find('[data-type=source-list]').findAll('option')
      await options[2].setSelected()
    })
    it('displays all fetched barcodes in print area', async () => {
      const value = 'DN1\nDN2\nDN3\nDN4\nDN5'
      await wrapper.find('#barcodes').setValue(value)
      const mockedFetchFunction = vi.fn().mockResolvedValue({
        foundBarcodes: new Set(['DN1', 'DN2', 'DN3', 'DN4', 'DN5']),
        attributes: {},
      })
      wrapper.vm.reception.fetchFunction = mockedFetchFunction
      await wrapper.vm.fetchLabware()
      expect(wrapper.find('[id=print-barcodes]').element.value).toEqual(value)
    })
    it('removes barcodes from print area when barcode is removed in  text area', async () => {
      const value = 'DN1\nDN2\nDN3\nDN4\nDN5'
      const barcodesInput = wrapper.find('#barcodes')
      await barcodesInput.setValue(value)
      let mockedFetchFunction = vi.fn().mockResolvedValue({
        foundBarcodes: new Set(['DN1', 'DN2', 'DN3', 'DN4', 'DN5']),
        attributes: {},
      })
      wrapper.vm.reception.fetchFunction = mockedFetchFunction

      //simulate fetch
      await wrapper.vm.fetchLabware()
      expect(wrapper.find('[id=print-barcodes]').element.value).toEqual(value)
      mockedFetchFunction = wrapper.vm.reception.fetchFunction = vi.fn().mockResolvedValue({
        foundBarcodes: new Set(['DN1', 'DN2', 'DN3', 'DN4']),
        attributes: {},
      })
      await wrapper.find('#barcodes').setValue('DN1\n,DN2\n,DN3\n,DN4\n,DN\n')
      await wrapper.vm.fetchLabware()
      expect(wrapper.find('[id=print-barcodes]').element.value).toEqual('DN1\nDN2\nDN3\nDN4')
    })
    it('enables print button only when print barcodes are present and a print option is selected', async () => {
      const value = 'DN1\nDN2\nDN3\nDN4\nDN5'
      const barcodesInput = wrapper.find('#barcodes')
      await barcodesInput.setValue(value)
      const mockedFetchFunction = vi.fn().mockResolvedValue({
        foundBarcodes: new Set(['DN1', 'DN2', 'DN3', 'DN4', 'DN5']),
        attributes: {},
      })
      wrapper.vm.reception.fetchFunction = mockedFetchFunction
      //simulate fetch
      await wrapper.vm.fetchLabware()
      expect(wrapper.find('[id=print-button]').element.disabled).toBe(true)
      //select printer
      const options = wrapper.find('[id=printer-choice]').findAll('option')
      await options[0].setSelected()
      expect(wrapper.find('[id=print-button]').element.disabled).toBe(false)
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
    await wrapper.vm.fetchStarted({ message: 'Starting fetch' })
    // But it fails
    await wrapper.vm.fetchFailed({ message: 'Failed fetch' })

    expect(wrapper.text()).not.toContain('Starting fetch')
    expect(Object.values(store.state.traction.messages)).toContainEqual({
      type: 'danger',
      message: 'Failed fetch',
    })
  })

  it('handles a successful import', async () => {
    store.state.traction.messages = []
    const mockedcreateReception = vi
      .spyOn(Reception, 'createReceptionResource')
      .mockImplementation(() => {})
    const mockedcreateMessages = vi.spyOn(Reception, 'createMessages').mockImplementation(() => {})
    const wrapper = buildWrapper()

    const foundBarcodes = new Set(['NT1'])
    const attributes = { source: 'traction-ui.sequencescape', request_attributes: [{}] }
    wrapper.vm.labwareData = { foundBarcodes, attributes }

    // We've begun the import
    await wrapper.vm.importLabware()
    expect(wrapper.text()).not.toContain('Creating 1 labware(s) for Sequencescape')
    expect(mockedcreateReception).toBeCalled
    expect(mockedcreateReception).toBeCalledWith(
      tractionReceptionsCreate,
      foundBarcodes,
      attributes,
    )
    expect(mockedcreateMessages).toBeCalled()
  })

  it('handles a failed import - save', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    store.state.traction.messages = []
    const message = 'The princess is in another castle'

    vi.spyOn(Reception, 'createReceptionResource').mockRejectedValue(new Error(message))
    const wrapper = buildWrapper()
    // We've begun the import
    await wrapper.vm.importLabware()
    expect(wrapper.text()).not.toContain('Creating 1 labware(s) for Sequencescape')

    await nextTick()

    expect(Object.values(store.state.traction.messages)).toContainEqual({
      type: 'danger',
      message: `Error: ${message}`,
    })
  })
})

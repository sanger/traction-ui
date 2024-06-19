import { mount, store, nextTick, createTestingPinia } from '@support/testHelper.js'
import { getCurrentDate } from '@/lib/DateHelpers.js'
import GeneralReception from '@/views/GeneralReception.vue'
import * as Reception from '@/services/traction/Reception.js'
import Receptions from '@/lib/receptions'
import { expect, it } from 'vitest'
import PrinterFactory from '@tests/factories/PrinterFactory.js'

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

const printerFactory = PrinterFactory()

function mountWithStore({ state = {}, stubActions = false, plugins = [], props } = {}) {
  const wrapperObj = mount(GeneralReception, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            printing: state,
          },
          stubActions,
          plugins,
        }),
      ],
    },
    props,
  })
  return { wrapperObj }
}

describe('GeneralReception', () => {
  const buildWrapper = () => {
    return mountWithStore({
      props: { receptions: Receptions },
      state: { resources: { printers: printerFactory.storeData } },
    })
  }

  it('has a source selector', () => {
    const { wrapperObj: wrapper } = buildWrapper()

    expect(
      wrapper
        .find('[data-type=source-list]')
        .findAll('option')
        .map((element) => element.text()),
    ).toEqual([
      'Sequencescape',
      'Samples Extraction',
      'Sequencescape Tubes',
      'Sequencescape Multiplexed Libraries',
    ])
    // It defaults to Sequencescape
    expect(wrapper.find('[data-type=source-list]').element.value).toEqual('Sequencescape')
  })

  it('shows print options for only for Sequencescape Tubes or Sequencescape Multiplexed Libraries', async () => {
    const { wrapperObj: wrapper } = buildWrapper()
    const options = wrapper.find('[data-type=source-list]').findAll('option')
    // It should show print options only when Sequencescape Tubes or Sequencescape Mutliplexed Libraries are the selected source
    await options[2].setSelected()
    expect(wrapper.find('[id=print]').exists()).toBe(true)
    await options[3].setSelected()
    expect(wrapper.find('[id=print]').exists()).toBe(true)
    // It should not show print options when Sequencescape or Samples Extraction is the selected source
    await options[0].setSelected()
    expect(wrapper.find('[id=print]').exists()).toBe(false)
    await options[1].setSelected()
    expect(wrapper.find('[id=print]').exists()).toBe(false)
  })

  it('has a pipeline selector', () => {
    const { wrapperObj: wrapper } = buildWrapper()
    expect(wrapper.find('[data-type=pipeline-list]').findAll('option')[0].text()).toBe('PacBio')
    expect(wrapper.find('[data-type=pipeline-list]').findAll('option')[1].text()).toBe('ONT')
    // It defaults to PacBio
    expect(wrapper.find('[data-type=pipeline-list]').element.value).toEqual('PacBio')
  })

  it('has a list of printers', () => {
    const { wrapperObj: wrapper } = buildWrapper()
    expect(wrapper.vm.printerOptions.length).toBeGreaterThan(0)
  })

  describe('request options', () => {
    it('has the a cost code input field', () => {
      const { wrapperObj: wrapper } = buildWrapper()
      expect(wrapper.find('[data-attribute=cost-code-input]')).toBeTruthy()
    })

    it('shows ONT options when ONT is selected', async () => {
      const { wrapperObj: wrapper } = buildWrapper()
      // Select ONT pipeline
      await wrapper.find('[data-type=pipeline-list]').findAll('option')[1].setSelected()

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
      const { wrapperObj: wrapper } = buildWrapper()
      // Select PacBio pipeline
      await wrapper.find('[data-type=pipeline-list]').findAll('option')[0].setSelected()

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
        const { wrapperObj: wrapper } = buildWrapper()
        await wrapper.find('#barcodes').setValue('DN1\n')
        expect(wrapper.vm.barcodes).toEqual('DN1\n')
        expect(wrapper.find('#importText').text()).toEqual(
          'Import 0 labware into PacBio from Sequencescape',
        )
      })
      it('should update importText when fetch function is called', async () => {
        const { wrapperObj: wrapper } = buildWrapper()
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
        const { wrapperObj: wrapper } = buildWrapper()
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
      const { wrapperObj } = buildWrapper()
      wrapper = wrapperObj
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
    const { wrapperObj: wrapper } = buildWrapper()
    expect(wrapper.text()).toContain('Summary')
    expect(wrapper.find('#importText').text()).toEqual(
      'Import 0 labware into PacBio from Sequencescape',
    )
    expect(wrapper.find('[data-action=reset-form]').text()).toEqual('Reset')
    expect(wrapper.find('[data-action=import-labware]').text()).toEqual('Import')
  })

  it('handles a failed import - load', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { wrapperObj: wrapper } = buildWrapper()
    wrapper.vm.reception.fetchFunction = vi.fn().mockRejectedValue('Failed fetch')

    await wrapper.vm.fetchLabware()
    expect(mockShowAlert).toHaveBeenCalledWith('Failed fetch', 'danger')
  })

  it('handles a successful import', async () => {
    store.state.traction.messages = []
    const mockedcreateReception = vi
      .spyOn(Reception, 'createReceptionResource')
      .mockImplementation(() => {})
    const mockedcreateMessages = vi.spyOn(Reception, 'createMessages').mockImplementation(() => {})
    const { wrapperObj: wrapper } = buildWrapper()

    const tractionReceptionsCreate = wrapper.vm.api.traction.receptions.create

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
    const { wrapperObj: wrapper } = buildWrapper()
    // We've begun the import
    await wrapper.vm.importLabware()
    expect(wrapper.text()).not.toContain('Creating 1 labware(s) for Sequencescape')

    await nextTick()

    expect(mockShowAlert).toHaveBeenCalledWith(new Error(message), 'danger')
  })

  // arbitrary test just to ensure this works
  describe('#createLabels', () => {
    it('will create some labels', async () => {
      const foundBarcodes = new Set(['DN1', 'DN2', 'DN3'])
      const date = getCurrentDate()
      const { wrapperObj: wrapper } = buildWrapper()
      const barcodeLabels = wrapper.vm.createLabels(foundBarcodes, date)
      expect(barcodeLabels.length).toEqual(3)
      const { barcode, second_line } = barcodeLabels[0]
      expect(barcode).toEqual('DN1')
      expect(second_line).toEqual('DN1')
    })
  })
})

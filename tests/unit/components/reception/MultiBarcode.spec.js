import { mount, store, nextTick, createTestingPinia } from '@support/testHelper.js'
import { getCurrentDate } from '@/lib/DateHelpers.js'
import MultiBarcode from '@/components/reception/MultiBarcode.vue'
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
  const wrapperObj = mount(MultiBarcode, {
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

describe('MultiBarcode', () => {
  const buildWrapper = (props = {}) => {
    return mountWithStore({
      props: {
        pipeline: 'PacBio',
        reception: Receptions['Sequencescape'],
        requestOptions: {
          costCode: '1234',
        },
        ...props,
      },
      state: { resources: { printers: printerFactory.storeData.printers } },
    })
  }

  it('shows print options for only for Sequencescape Tubes', async () => {
    const { wrapperObj: wrapper } = buildWrapper()
    // It should show print options only when Sequencescape Tubes or Sequencescape Mutliplexed Libraries are the selected source
    await wrapper.setProps({ reception: Receptions['SequencescapeTubes'] })
    expect(wrapper.find('[id=print]').exists()).toBe(true)

    await wrapper.setProps({ reception: Receptions['Sequencescape'] })
    expect(wrapper.find('[id=print]').exists()).toBe(false)
    await wrapper.setProps({ reception: Receptions['Samples Extraction'] })
    expect(wrapper.find('[id=print]').exists()).toBe(false)
  })

  it('has a list of printers', () => {
    const { wrapperObj: wrapper } = buildWrapper()
    expect(wrapper.vm.printerOptions.length).toBeGreaterThan(0)
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
      const { wrapperObj } = buildWrapper({ reception: Receptions['SequencescapeTubes'] })
      wrapper = wrapperObj
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

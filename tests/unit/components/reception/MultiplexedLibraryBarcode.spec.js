import { mount, createTestingPinia } from '@support/testHelper.js'
import { getCurrentDate } from '@/lib/DateHelpers.js'
import MultiplexedLibraryBarcode from '@/components/reception/MultiplexedLibraryBarcode.vue'
import Receptions from '@/lib/receptions'
import { expect, it } from 'vitest'
import PrinterFactory from '@tests/factories/PrinterFactory.js'
import { flushPromises } from '@vue/test-utils'
import OntTagSetFactory from '@tests/factories/OntTagSetFactory.js'
import { scanBarcodesInLabwhereLocation } from '@/services/labwhere/client.js'
import { sharedTestsForImportAndScanIn } from './SharedTestsForImportAndScanIn.js'

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))
vi.mock('@/services/labwhere/client.js')
const printerFactory = PrinterFactory()
const ontTagSetFactory = OntTagSetFactory()

async function mountWithStore({ state = {}, stubActions = false, plugins = [], props } = {}) {
  const wrapperObj = mount(MultiplexedLibraryBarcode, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            printing: state,
            root: state,
          },
          stubActions,
          plugins,
        }),
      ],
    },
    props,
  })

  await flushPromises()
  return { wrapperObj }
}

describe('MultiplexedLibraryBarcode', () => {
  const plugins = [
    ({ store }) => {
      if (store.$id === 'root') {
        store.api.v2.traction.ont.tag_sets.get = vi.fn(() => ontTagSetFactory.responses.fetch)
      }
    },
  ]

  const buildWrapper = async (props = {}) => {
    return await mountWithStore({
      props: {
        pipeline: 'ONT',
        reception: Receptions['SequencescapeMultiplexedLibraries'],
        requestOptions: {
          costCode: '1234',
        },
        workflowLocationText: 'The imported labware will be scanned into LRT020 Draw 1',
        userCode: 'user1',
        locationBarcode: 'location1',
        ...props,
      },
      plugins,
      state: { resources: { printers: printerFactory.storeData.printers } },
    })
  }

  it('has a list of printers', async () => {
    const { wrapperObj: wrapper } = await buildWrapper()
    expect(wrapper.vm.printerOptions.length).toBeGreaterThan(0)
  })

  describe('barcode', () => {
    describe('single barcode', () => {
      it('should not update importText until barcode is fetched', async () => {
        const { wrapperObj: wrapper } = await buildWrapper()
        await wrapper.find('#barcode').setValue('DN1')
        expect(wrapper.vm.barcode).toEqual('DN1')
        expect(wrapper.find('#importText').text()).toEqual(
          'Import 0 labware into ONT from Sequencescape Multiplexed Libraries',
        )
      })

      it('should update importText when fetch function is called', async () => {
        const { wrapperObj: wrapper } = await buildWrapper()
        await wrapper.find('#barcode').setValue('DN1')
        const mockedFetchFunction = vi
          .fn()
          .mockResolvedValue({ foundBarcodes: new Set(['DN1']), attributes: {} })
        wrapper.vm.reception.fetchFunction = mockedFetchFunction
        await wrapper.vm.fetchLabware()

        expect(mockedFetchFunction).toBeCalled()
        expect(wrapper.vm.labwareData.foundBarcodes).toEqual(new Set(['DN1']))
        expect(wrapper.find('#importText').text()).toEqual(
          'Import 1 labware into ONT from Sequencescape Multiplexed Libraries',
        )
      })
    })
  })

  describe('print area', () => {
    let wrapper

    beforeEach(async () => {
      const { wrapperObj } = await buildWrapper()
      wrapper = wrapperObj
    })

    it('displays all fetched barcodes in print area', async () => {
      const value = 'DN1'
      await wrapper.find('#barcode').setValue(value)
      const mockedFetchFunction = vi.fn().mockResolvedValue({
        foundBarcodes: new Set(['DN1']),
        attributes: {},
      })
      wrapper.vm.reception.fetchFunction = mockedFetchFunction
      await wrapper.vm.fetchLabware()
      expect(wrapper.find('[id=print-barcodes]').element.value).toEqual(value)
    })

    it('removes barcodes from print area when barcode is removed in text area', async () => {
      const value = 'DN1'
      const barcodesInput = wrapper.find('#barcode')
      await barcodesInput.setValue(value)
      let mockedFetchFunction = vi.fn().mockResolvedValue({
        foundBarcodes: new Set(['DN1']),
        attributes: {},
      })
      wrapper.vm.reception.fetchFunction = mockedFetchFunction

      //simulate fetch
      await wrapper.vm.fetchLabware()
      expect(wrapper.find('[id=print-barcodes]').element.value).toEqual(value)
      mockedFetchFunction = wrapper.vm.reception.fetchFunction = vi.fn().mockResolvedValue({
        foundBarcodes: new Set(['DN2']),
        attributes: {},
      })
      await wrapper.find('#barcode').setValue('DN2')
      await wrapper.vm.fetchLabware()
      expect(wrapper.find('[id=print-barcodes]').element.value).toEqual('DN2')
    })

    it('enables print button only when print barcodes are present and a print option is selected', async () => {
      const value = 'DN1'
      const barcodesInput = wrapper.find('#barcode')
      await barcodesInput.setValue(value)
      const mockedFetchFunction = vi.fn().mockResolvedValue({
        foundBarcodes: new Set(['DN1']),
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

  it('has a summary area', async () => {
    const { wrapperObj: wrapper } = await buildWrapper()
    expect(wrapper.text()).toContain('Summary')
    expect(wrapper.find('#importText').text()).toEqual(
      'Import 0 labware into ONT from Sequencescape Multiplexed Libraries',
    )
    expect(wrapper.find('[data-action=reset-form]').text()).toEqual('Reset')
    expect(wrapper.find('[data-action=import-labware]').text()).toEqual('Import')
  })

  describe('Import and scan in labware to abWhere ', async () => {
    const { wrapperObj: wrapper } = await buildWrapper()
    sharedTestsForImportAndScanIn(
      wrapper,
      scanBarcodesInLabwhereLocation,
      mockShowAlert,
      'Sequencescape Multiplexed Libraries',
    )
  })

  // arbitrary test just to ensure this works
  describe('#createLabels', () => {
    it('will create some labels', async () => {
      const foundBarcodes = new Set(['DN1'])
      const date = getCurrentDate()
      const { wrapperObj: wrapper } = await buildWrapper()
      const barcodeLabels = wrapper.vm.createLabels(foundBarcodes, date)
      expect(barcodeLabels.length).toEqual(1)
      const { barcode, second_line } = barcodeLabels[0]
      expect(barcode).toEqual('DN1')
      expect(second_line).toEqual('DN1')
    })
  })
})

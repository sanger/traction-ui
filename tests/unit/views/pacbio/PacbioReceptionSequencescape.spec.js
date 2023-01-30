import Reception from '@/views/pacbio/PacbioReceptionSequencescape'
import { mount, localVue, store, router } from '@support/testHelper'
import * as pacbio from '@/services/traction/Pacbio'

describe('PacbioReceptionSequencescape', () => {
  let wrapper, reception, barcodes, barcode, input

  beforeEach(() => {
    barcodes = 'DN1\nDN2\nDN3\nDN4\nDN5'
    wrapper = mount(Reception, { localVue, router, store })
    reception = wrapper.vm
  })

  describe('libraryType', () => {
    it('lists the expected options', () => {
      const select = wrapper.find('select')
      expect(select.find('option[value="Pacbio_HiFi"]').exists()).toBe(true)
      expect(select.find('option[value="Pacbio_IsoSeq"]').exists()).toBe(true)
      expect(select.find('option[value=""]').exists()).toBe(true)
      expect(select.find('option[value="_undefined"]').exists()).toBe(true)
    })
  })

  describe('scanning in barcodes', () => {
    it('single barcode', async () => {
      barcode = 'DN1\n'
      input = wrapper.find('textarea')
      await input.setValue(barcode)
      expect(reception.barcodes).toEqual(barcode)
      expect(wrapper.find('#createTractionPlates').text()).toEqual('Import 1 labware')
    })

    it('multiple barcodes', async () => {
      input = wrapper.find('textarea')
      await input.setValue(barcodes)
      expect(reception.barcodes).toEqual(barcodes)
      expect(wrapper.find('#createTractionPlates').text()).toEqual('Import 5 labware')
    })
  })

  describe('createTractionPlates button', () => {
    beforeEach(() => {
      wrapper.setData({ barcodes: 'DN1\nDN2' })
      reception.createTractionPlates = vi.fn()
    })

    it('calls the right function', async () => {
      const input = wrapper.find('textarea')
      await input.setValue(barcodes)
      const button = wrapper.find('#createTractionPlates')
      await button.trigger('click')
      expect(reception.createTractionPlates).toBeCalled()
    })
  })

  describe('#createTractionPlates', () => {
    beforeEach(() => {
      wrapper = mount(Reception, { localVue, store })
      reception = wrapper.vm
      reception.showAlert = vi.fn()
      wrapper.setData({ barcodes: 'DN1\nDN2' })
    })

    it('reports success when createLabware works', async () => {
      const mockedcreateLabware = vi.spyOn(pacbio, 'createLabware').mockImplementation(() => {})

      mockedcreateLabware.mockResolvedValue({
        status: 'success',
        message: 'Samples have been created with barcodes: DN1, DN2',
      })

      await reception.createTractionPlates()

      expect(mockedcreateLabware).toBeCalledWith({
        requests: expect.objectContaining({
          sequencescape: expect.anything(),
          traction: expect.anything(),
        }),
        barcodes: ['DN1', 'DN2'],
        libraryType: undefined,
      })
      expect(reception.showAlert).toBeCalledWith(
        'Samples have been created with barcodes: DN1, DN2',
        'success',
      )
    })

    it('passes library type when selected', async () => {
      const mockedcreateLabware = vi.spyOn(pacbio, 'createLabware').mockImplementation(() => {})

      mockedcreateLabware.mockResolvedValue({
        status: 'success',
        message: 'Samples have been created with barcodes: DN1, DN2',
      })

      await wrapper.setData({ libraryType: 'Example' })
      await reception.createTractionPlates()

      expect(mockedcreateLabware).toBeCalledWith({
        requests: expect.objectContaining({
          sequencescape: expect.anything(),
          traction: expect.anything(),
        }),
        barcodes: ['DN1', 'DN2'],
        libraryType: 'Example',
      })
    })

    it('is unsuccessful when getSampleExtractionPlatesForBarcodes fails', async () => {
      const mockedcreateLabware = vi.spyOn(pacbio, 'createLabware').mockImplementation(() => {})

      mockedcreateLabware.mockResolvedValue({
        status: 'danger',
        message: 'Failed to create samples: title Plate could not be found.',
      })

      await reception.createTractionPlates()

      expect(mockedcreateLabware).toBeCalled()

      expect(reception.showAlert).toBeCalledWith(
        'Failed to create samples: title Plate could not be found.',
        'danger',
      )
    })
  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      reception.showAlert('show this message', 'danger')
      expect(Object.values(store.state.traction.messages)).toContainEqual({
        type: 'danger',
        message: 'show this message',
      })
    })
  })
})

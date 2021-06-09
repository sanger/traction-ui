import Reception from '@/views/ont/OntReception'
import { mount, localVue, Data } from '../../testHelper'
import Response from '@/api/Response'
import store from '@/store'
import { transformPlates, OntSample } from '@/services/Sequencescape'
import flushPromises from 'flush-promises'

describe('Reception', () => {
  let wrapper, reception, barcodes, input, mockPlates, mutate

  beforeEach(() => {
    mockPlates = new Response(Data.SequencescapePlates).deserialize.plates

    barcodes = 'DN1234567\nDN2345678\nDN5845675\nDN8993423\nDN666666'
    mutate = jest.fn()
    wrapper = mount(Reception, {
      localVue,
      store,
      mocks: {
        $apollo: {
          mutate: mutate,
        },
      },
    })
    reception = wrapper.vm
  })

  it('will have some barcodes', () => {
    wrapper.setData({ barcodes: barcodes })
    expect(reception.barcodes.length).toEqual(barcodes.length)
  })

  describe('scanning in barcodes', () => {
    it('single barcode', () => {
      let barcode = 'TRAC-1\n'
      input = wrapper.find('textarea')
      input.setValue(barcode)
      expect(reception.barcodes).toEqual(barcode)
    })

    it('multiple barcodes', () => {
      input = wrapper.find('textarea')
      input.setValue(barcodes)
      expect(reception.barcodes).toEqual(barcodes)
    })
  })

  describe('#formattedBarcodes', () => {
    it('single barcode', () => {
      wrapper.setData({ barcodes: 'DN1234567\n' })
      let result = reception.formattedBarcodes
      expect(result).toEqual('DN1234567')
    })

    it('multiple barcodes', () => {
      wrapper.setData({ barcodes: barcodes })
      let result = reception.formattedBarcodes
      expect(result).toEqual('DN1234567,DN2345678,DN5845675,DN8993423,DN666666')
    })
  })

  describe('createTractionPlates button', () => {
    beforeEach(() => {
      wrapper.setData({ barcodes: 'DN1234567\n' })
      reception.handleCreateTractionPlates = jest.fn()
    })

    it('calls the right function', () => {
      let input = wrapper.find('textarea')
      input.setValue(barcodes)
      let button = wrapper.find('#createTractionPlates')
      button.trigger('click')
      expect(reception.handleCreateTractionPlates).toBeCalled()
    })
  })

  describe('handleCreateTractionPlates', () => {
    beforeEach(() => {
      wrapper.setData({ barcodes: 'DN1234567\n' })
      reception.getSequencescapePlates = jest.fn()
      reception.showAlert = jest.fn()
    })

    it('shows an alert when there are no sequencescape plates', async () => {
      reception.getSequencescapePlates.mockReturnValue([])
      await reception.handleCreateTractionPlates()
      expect(reception.showAlert).toBeCalledWith(
        'There is no plate is sequencescape with barcode(s) DN1234567',
        'danger',
      )
    })

    it('calls createTractionPlates shows an alert with the result', async () => {
      reception.getSequencescapePlates.mockReturnValue(mockPlates)

      reception.createTractionPlates = jest.fn()

      let mockResponse = 'Plate x message'
      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      reception.createTractionPlates.mockReturnValue(promise)
      await reception.handleCreateTractionPlates()
      expect(reception.createTractionPlates).toBeCalledWith(
        transformPlates({
          plates: mockPlates,
          sampleType: OntSample,
        }),
      )
      expect(reception.showAlert).toBeCalledWith(mockResponse, 'primary')
    })
  })

  describe('createTractionPlates', () => {
    beforeEach(() => {
      reception.createTractionPlate = jest.fn()
      wrapper.setData({ barcodes: barcodes })
    })

    it('will call createTractionPlate and return a list of responses', async () => {
      let mockResponse = 'Plate x message'
      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })
      reception.createTractionPlate.mockReturnValue(promise)

      let response = await reception.createTractionPlates(
        transformPlates({
          plates: mockPlates,
          sampleType: OntSample,
        }),
      )
      await flushPromises()
      expect(reception.createTractionPlate).toHaveBeenCalledTimes(mockPlates.length)
      expect(response).toEqual(['Plate x message', 'Plate x message'])
    })
  })

  describe('createTractionPlate', () => {
    let response

    it('returns a message on success', async () => {
      let mockResponse = {
        data: {
          createPlateWithSamples: {
            plate: {
              id: '6',
              barcode: 'PLATE-1234',
              wells: [{ plateId: 1 }, { plateId: 1 }, { plateId: 1 }],
            },
            errors: [],
          },
        },
      }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })
      mutate.mockReturnValue(promise)

      response = await reception.createTractionPlate(mockPlates[0])
      expect(mutate).toBeCalled()
      expect(response).toEqual(`Plate ${mockPlates[0].barcode} successfully created`)
    })

    it('shows an alert on failure', async () => {
      let mockResponse = {
        data: { createPlateWithSamples: { plate: {}, errors: ['this is an error'] } },
      }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })
      mutate.mockReturnValue(promise)

      response = await reception.createTractionPlate(mockPlates[0])
      expect(mutate).toBeCalled()
      expect(response).toEqual(`Plate ${mockPlates[0].barcode} - this is an error`)
    })
  })
})

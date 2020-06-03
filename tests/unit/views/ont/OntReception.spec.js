import Reception from '@/views/ont/OntReception'
import { mount, localVue, Data } from '../../testHelper'
import Response from '@/api/Response'
import store from '@/store'
import { transformPlates } from '@/api/SequencescapePlates'
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
          mutate: mutate
        }
      }
    })
    reception = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Reception')
  })

  it('will have some barcodes', () => {
    expect(reception.barcodes.length).toEqual(0)
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

  describe('#isDisabled', () => {
    it('true if there are no barcodes', () => {
      reception.barcodes = ''
      expect(reception.isDisabled).toBeTruthy()
    })

    it('true if plates are being exported', () => {
      reception.importing = true
      expect(reception.isDisabled).toBeTruthy()
    })
  })

  describe('#getBarcodes', () => {
    it('single barcode', () => {
      wrapper.setData({ barcodes: 'DN1234567\n' })
      let result = reception.getBarcodes()
      expect(result).toEqual('DN1234567')
    })

    it('multiple barcodes', () => {
      wrapper.setData({ barcodes: barcodes })
      let result = reception.getBarcodes()
      expect(result).toEqual('DN1234567,DN2345678,DN5845675,DN8993423,DN666666')
    })
  })

  describe('createTractionPlates button', () => {

    beforeEach(() => {
      reception.createTractionPlates = jest.fn()
    })

    it('calls the right function', () => {
      let input = wrapper.find('textarea')
      input.setValue(barcodes)
      let button = wrapper.find('#createTractionPlates')
      button.trigger('click')
      expect(reception.createTractionPlates).toBeCalled()
    })

  })

  describe('get sequencescape plates', () => {

    beforeEach(() => {
      reception.getSequencescapePlates = jest.fn()
      reception.barcodes = barcodes
    })

    it('successfully', async () => {
      reception.getSequencescapePlates.mockReturnValue(mockPlates)
      await reception.handleSequencesapePlates()
      expect(reception.plates).toEqual(transformPlates(mockPlates))
    })

    it('unsuccessfully', async () => {
      reception.getSequencescapePlates.mockReturnValue(undefined)
      await reception.handleSequencesapePlates()
      expect(reception.plates).toEqual({})
    })
  })

  describe('create sequencescape plate', () => {

    let response 

    beforeEach(() => {
      wrapper.setData({ barcodes: 'DN1234567\n', plates: transformPlates(mockPlates) })
      reception.getSequencescapePlates = jest.fn()
      reception.showAlert = jest.fn()
    })

    it('shows an alert on success', async () => {

      let mockResponse =  { data: 
                            { createPlateWithSamples: {
                              plate: {id: "6",barcode: "PLATE-1234",wells: 
                              [ { plateId: 1},
                                { plateId: 1},
                                { plateId: 1}
                              ]
                            }, errors: []}}}

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      mutate.mockReturnValue(promise)

      response = await reception.createTractionPlate(reception.plates[0])
      expect(mutate).toBeCalled()
      expect(response).toEqual(`Plate ${reception.plates[0].barcode} successfully created`)
    })

    it('shows an alert on failure', async () => {
      let mockResponse = { data: { createPlateWithSamples: { plate: {}, errors: ['this is an error'] } } }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      mutate.mockReturnValue(promise)
      response = await reception.createTractionPlate(reception.plates[0])
      expect(mutate).toBeCalled()
      expect(response).toEqual(`Plate ${reception.plates[0].barcode} - this is an error`)
    })
  })

  describe('create sequencescape plates', () => {

    beforeEach(() => {
      reception.getSequencescapePlates = jest.fn()
      reception.showAlert = jest.fn()
      reception.createTractionPlate = jest.fn()

      mockPlates = barcodes.split('\n').map(barcode => ({ barcode: barcode, wells: {} }))
      wrapper.setData({ barcodes: barcodes, plates: mockPlates })
    })

    it('will attempt to create all of the plates', async () => {

      let promise = new Promise((resolve) => {
        resolve('shit storm')
      })

      reception.createTractionPlate.mockReturnValue(promise)

      let button = wrapper.find('#createTractionPlates')
      await button.trigger('click')
      await flushPromises()
      expect(reception.getSequencescapePlates).toBeCalledWith(reception.getBarcodes())
      expect(reception.createTractionPlate).toHaveBeenCalledTimes(mockPlates.length)
      expect(reception.showAlert).toBeCalledWith('shit storm,shit storm,shit storm,shit storm,shit storm', 'success')
      expect(reception.importing).toBeFalsy()
    })

  })

})

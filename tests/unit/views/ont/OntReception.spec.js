import Reception from '@/views/ont/OntReception'
import { mount, localVue, Data } from '../../testHelper'
import Alert from '@/components/Alert'
import Response from '@/api/Response'
import store from '@/store'
import { transformPlates } from '@/api/SequencescapePlates'

describe('Reception', () => {

  let wrapper, reception, barcodes, input, mockPlates

  beforeEach(() => {
    mockPlates = new Response(Data.SequencescapePlates).deserialize.plates

    barcodes = 'DN1234567\nDN2345678\nDN5845675\nDN8993423\nDN666666'
    wrapper = mount(Reception, {
      localVue,
      store,
      stubs: {
        Alert: Alert
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

  describe('findSequencescapePlates button', () => {

    beforeEach(() => {
      reception.handleSequencescapePlates = jest.fn()
    })

    it('calls the right function', () => {
      let input = wrapper.find('textarea')
      input.setValue(barcodes)
      let button = wrapper.find('#findSequencescapePlates')
      button.trigger('click')
      expect(reception.handleSequencescapePlates).toBeCalled()
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

})

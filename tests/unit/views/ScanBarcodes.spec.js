import ScanBarcodes from '@/views/ScanBarcodes'
import { mount, localVue } from '../testHelper'
import TubesJson from '../../data/tubes'
import Response from '@/api/Response'
import flushPromises from 'flush-promises'

describe('Scan Barcodes', () => {

  let wrapper, scan, barcodes, barcode

  beforeEach(() => {
    barcodes = 'TRAC-1\nTRAC-2\nTRAC-3\nTRAC-4\nTRAC-5'
    wrapper = mount(ScanBarcodes, { localVue } )
    scan = wrapper.vm
  })

  describe('scanning in barcodes', () => {
    it('single barcode', () => {
      barcode = 'TRAC-1\n'
      const input = wrapper.find('textarea')
      input.setValue(barcode)
      expect(scan.barcodes).toEqual(barcode)
      expect(scan.queryString).toEqual('TRAC-1')
    })

    it('multiple barcodes', () => {
      const input = wrapper.find('textarea')
      input.setValue(barcodes)
      expect(scan.barcodes).toEqual(barcodes)
      expect(scan.queryString).toEqual('TRAC-1,TRAC-2,TRAC-3,TRAC-4,TRAC-5')
    })

    it('will build a request', () => {
      scan.barcodes = barcodes
      let request = scan.tubeRequest
      expect(request.include).toEqual('material')
    })
  })

  it('will allow tubes to be found', async () => {
    scan.barcodes = barcodes
    scan.tubeRequest.execute = jest.fn()
    scan.tubeRequest.execute.mockResolvedValue(TubesJson)

    let response = await scan.findTubes()
    expect(response).toEqual(new Response(TubesJson).deserialize.tubes)
  })

  it('will allow scanning in of barcodes and will return the relevant tube', () => {
    const input = wrapper.find('textarea')
    input.setValue(barcodes)
    let button = wrapper.find('#findTubes')
    button.trigger('click')
  })

  describe('scanning in barcodes', () => {

    beforeEach(() => {
      scan.tubeRequest.get = jest.fn()
    })

    describe('by finding tubes', () => {

      beforeEach(() => {
        scan.barcodes = barcodes
      })

      it('successfully', async () => {
        scan.tubeRequest.get.mockResolvedValue(TubesJson)

        let response = await scan.findTubes()
        expect(scan.tubeRequest.get).toBeCalledWith({ filter: { barcode: scan.queryString } })
        expect(response).toEqual(new Response(TubesJson).deserialize.tubes)
      })

      it('unsuccessfully', async () => {
        let remoteResponse = { data: { status: 500, statusText: 'Internal Server Error'}}
        scan.tubeRequest.get.mockReturnValue(remoteResponse)

        let response = await scan.findTubes()
        expect(response).toEqual(new Response(remoteResponse))
      })

    })

    it('by clicking the button', async () => {
      scan.tubeRequest.get.mockResolvedValue(TubesJson)
      const input = wrapper.find('textarea')
      input.setValue(barcodes)
      let button = wrapper.find('#findTubes')
      button.trigger('click')
      await flushPromises()
      expect(scan.message).toEqual('tubes successfully found')
    })

  })

})
import { Data } from '../../../../testHelper'
import Response from '@/api/Response'
import * as Actions from '@/store/traction/pacbio/tubes/actions'

describe('#isLibraryBarcodeValid', () => {
  let dispatch

  beforeEach(() => {
    dispatch = jest.fn()
  })

  it('will return false when barcode is null', async () => {
    let result = await Actions.isLibraryBarcodeValid({ dispatch }, '')
    expect(result).toEqual(false)
  })

  it('will return false if the barcode belongs to a sample', async () => {
    let sampleTube = new Response(Data.TractionTubesWithSample).deserialize.tubes[0]
    dispatch.mockReturnValue(sampleTube)
    let result = await Actions.isLibraryBarcodeValid({ dispatch }, 'TRAC-1')
    expect(result).toEqual(false)
  })

  it('will return true if the barcode belongs to a library', async () => {
    let libraryTube = new Response(Data.TractionTubeWithContainerMaterials).deserialize.tubes[0]
    dispatch.mockReturnValue(libraryTube)
    let result = await Actions.isLibraryBarcodeValid({ dispatch }, 'TRAC-1')
    expect(result).toEqual(true)
  })
})

describe('#getTubeForBarcode', () => {
  let get, rootGetters, barcode, failedResponse

  beforeEach(() => {
    get = jest.fn()
    rootGetters = { 'traction/pacbio/tubes/tubeRequest': { 'get': get } }
    barcode = 'TRAC-1'

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    get.mockReturnValue(Data.TractionTubeWithContainerMaterials)

    let expectedResponse = new Response(Data.TractionTubeWithContainerMaterials)
    let response = await Actions.getTubeForBarcode({ rootGetters }, barcode)

    expect(response).toEqual(expectedResponse.deserialize.tubes[0])
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    let response = await Actions.getTubeForBarcode({ rootGetters }, barcode)
    expect(response).toEqual()
  })
})

describe('#validateLibraryTube', () => {
  it('returns false if tube doesnt exist', () => {
    expect(Actions.validateLibraryTube()).toBeFalsy()
  })

  it('returns false if tube doesnt have material', () => {
    expect(Actions.validateLibraryTube({ 'no material': '' })).toBeFalsy()
  })

  it('returns false if tube doesnt have material with libraries', () => {
    expect(Actions.validateLibraryTube({ 'materials': [{ 'notype': '' }] })).toBeFalsy()
  })

  it('returns true valid', () => {
    // check the validation of a library
    expect(Actions.validateLibraryTube({ 'materials': [{ 'library_kit_barcode': 'present' }] })).toBeTruthy()
  })
})


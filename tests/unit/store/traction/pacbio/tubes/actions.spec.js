import { Data } from '@support/testHelper'
import Response from '@/api/Response'
import * as Actions from '@/store/traction/pacbio/tubes/actions'

describe('#isLibraryBarcodeValid', () => {
  let dispatch

  beforeEach(() => {
    dispatch = vi.fn()
  })

  it('will return false when barcode is null', async () => {
    let result = await Actions.isLibraryBarcodeValid({ dispatch }, '')
    expect(result).toEqual(false)
  })

  it('will return false if there is no pool', async () => {
    let sampleTube = new Response(Data.TractionTubesWithPacbioPools).deserialize.tubes[0]
    dispatch.mockReturnValue(sampleTube)
    let result = await Actions.isLibraryBarcodeValid({ dispatch }, 'TRAC-1')
    expect(result).toEqual(false)
  })

  it('will return false if the pool is not ready', async () => {
    let sampleTube = new Response(Data.TractionTubesWithPacbioPools).deserialize.tubes[1]
    dispatch.mockReturnValue(sampleTube)
    let result = await Actions.isLibraryBarcodeValid({ dispatch }, 'TRAC-2')
    expect(result).toEqual(false)
  })

  it('will return true if the pool is ready', async () => {
    let libraryTube = new Response(Data.TractionTubesWithPacbioPools).deserialize.tubes[2]
    dispatch.mockReturnValue(libraryTube)
    let result = await Actions.isLibraryBarcodeValid({ dispatch }, 'TRAC-3')
    expect(result).toEqual(true)
  })
})

describe('#getTubeForBarcode', () => {
  let get, getters, barcode, failedResponse

  beforeEach(() => {
    get = vi.fn()
    getters = { tubeRequest: { get: get } }
    barcode = 'TRAC-1'

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    get.mockReturnValue(Data.TractionTubeWithContainerMaterials)

    let expectedResponse = new Response(Data.TractionTubeWithContainerMaterials)
    let response = await Actions.getTubeForBarcode({ getters }, barcode)

    expect(response).toEqual(expectedResponse.deserialize.tubes[0])
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    let response = await Actions.getTubeForBarcode({ getters }, barcode)
    expect(response).toEqual()
  })
})

describe('#validateLibraryTube', () => {
  it("returns false if tube doesn't exist", () => {
    expect(Actions.validateLibraryTube()).toBeFalsy()
  })

  it("returns false if tube doesn't have pools", () => {
    expect(Actions.validateLibraryTube({ 'no pools': '' })).toBeFalsy()
  })

  it('returns false if the pool is not complete', () => {
    expect(Actions.validateLibraryTube({ pools: [{}] })).toBeFalsy()
  })

  it('returns true if valid', () => {
    // check the validation of a library
    expect(
      Actions.validateLibraryTube({
        pools: [
          {
            volume: 100,
            concentration: 200,
            template_prep_kit_box_barcode: 'barcode',
            insert_size: 122,
          },
        ],
      }),
    ).toBeTruthy()
  })
})

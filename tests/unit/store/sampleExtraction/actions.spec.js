import * as Actions from '@/store/sampleExtraction/actions'
import { Data } from 'testHelper'
import Response from '@/api/Response'

describe('#getSampleExtractionTubesForBarcodes', () => {
  let commit, get, getters, barcodeList, failedResponse, emptyResponse

  beforeEach(() => {
    commit = jest.fn()
    get = jest.fn()
    getters = { sampleExtractionTubeRequest: { get: get } }
    barcodeList = ['NT4R']

    emptyResponse = { data: { data: [] }, status: 200, statusText: 'Success' }
    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully for samples', async () => {
    get.mockReturnValue(Data.SampleExtractionTubesWithSample)

    let expectedResponse = new Response(Data.SampleExtractionTubesWithSample)
    let expectedTubes = expectedResponse.deserialize.assets

    let response = await Actions.getSampleExtractionTubesForBarcodes(
      { commit, getters },
      barcodeList,
    )

    expect(commit).toHaveBeenCalledWith('setSampleExtractionTubes', expectedTubes)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    let expectedResponse = new Response(failedResponse)

    let response = await Actions.getSampleExtractionTubesForBarcodes(
      { commit, getters },
      barcodeList,
    )

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })

  it('when no tubes exist', async () => {
    get.mockReturnValue(emptyResponse)

    let expectedResponse = new Response(emptyResponse)

    let response = await Actions.getSampleExtractionTubesForBarcodes(
      { commit, getters },
      barcodeList,
    )

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })
})

import * as Actions from '@/store/sampleExtraction/actions'
import { Data } from 'testHelper'
import { newResponse } from '@/api/ResponseHelper'
import deserialize from '@/api/JsonApi'

describe('#getSampleExtractionTubesForBarcodes', () => {
  let commit, get, getters, barcodeList, failedResponse, emptyResponse

  beforeEach(() => {
    commit = jest.fn()
    get = jest.fn()
    getters = { sampleExtractionTubeRequest: { get: get } }
    barcodeList = ['NT4R']

    emptyResponse = { success: true, data: { data: [] }, status: 200, statusText: 'Success' }
    failedResponse = {
      success: false,
      data: { data: [] },
      status: 500,
      statusText: 'Internal Server Error',
    }
  })

  it('successfully for samples', async () => {
    get.mockReturnValue(Data.SampleExtractionTubesWithSample)

    const expectedResponse = newResponse({
      ...Data.SampleExtractionTubesWithSample,
      success: true,
    })

    let expectedTubes = deserialize(expectedResponse.data).assets

    let response = await Actions.getSampleExtractionTubesForBarcodes(
      { commit, getters },
      barcodeList,
    )

    expect(commit).toHaveBeenCalledWith('setSampleExtractionTubes', expectedTubes)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    const expectedResponse = newResponse({
      ...failedResponse,
      success: false,
    })

    let response = await Actions.getSampleExtractionTubesForBarcodes(
      { commit, getters },
      barcodeList,
    )

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })

  it('when no tubes exist', async () => {
    get.mockReturnValue(emptyResponse)

    const expectedResponse = newResponse({
      ...emptyResponse,
      success: true,
    })

    let response = await Actions.getSampleExtractionTubesForBarcodes(
      { commit, getters },
      barcodeList,
    )

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })
})

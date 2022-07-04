import * as Actions from '@/store/sampleExtraction/actions'
import { Data } from '@support/testHelper'
import { newResponse } from '@/api/ResponseHelper'
import deserialize from '@/api/JsonApi'

describe('#getSampleExtractionTubesForBarcodes', () => {
  let commit, get, getters, barcodeList, failedResponse, emptyResponse

  beforeEach(() => {
    commit = vi.fn()
    get = vi.fn()
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

    const expectedResponse = {
      success: false,
      errors: 'Sample Extraction tubes failed to be imported',
    }

    let response = await Actions.getSampleExtractionTubesForBarcodes(
      { commit, getters },
      barcodeList,
    )

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })

  it('when no tubes exist', async () => {
    get.mockReturnValue(emptyResponse)

    const expectedResponse = {
      success: false,
      errors: 'Sample Extraction tubes failed to be imported',
    }

    let response = await Actions.getSampleExtractionTubesForBarcodes(
      { commit, getters },
      barcodeList,
    )

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })
})

import SequencescapeTubesJson from '../../../data/sequencescapeTubesWithSample'
import Response from '@/api/Response'
import * as Actions from '@/store/sequencescape/actions'

describe('#getSequencescapeTubesForBarcodes', () => {
  let commit, get, getters, barcodeString, failedResponse, emptyResponse

  beforeEach(() => {
    commit = jest.fn()
    get = jest.fn()
    getters = { 'sequencescapeTubeRequest': { 'get': get } }
    barcodeString = "NT4R"

    emptyResponse = { data: { data: [] }, status: 200, statusText: 'Success'}
    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully for samples', async () => {
    get.mockReturnValue(SequencescapeTubesJson)

    let expectedResponse = new Response(SequencescapeTubesJson)
    let expectedTubes = expectedResponse.deserialize.tubes

    let response = await Actions.getSequencescapeTubesForBarcodes({ commit, getters }, barcodeString)

    expect(commit).toHaveBeenCalledWith("setSequencescapeTubes", expectedTubes)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    let expectedResponse = new Response(failedResponse)

    let response = await Actions.getSequencescapeTubesForBarcodes({ commit, getters }, barcodeString)

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })

  it('when no tubes exist', async () => {
    get.mockReturnValue(emptyResponse)

    let expectedResponse = new Response(emptyResponse)

    let response = await Actions.getSequencescapeTubesForBarcodes({ commit, getters }, barcodeString)

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })
})

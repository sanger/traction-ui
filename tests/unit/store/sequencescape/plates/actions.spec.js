import * as Actions from '@/store/sequencescape/plates/actions'
import { Data } from '../../../testHelper'
import Response from '@/api/Response'

describe('#getSequencescapePlates', () => {
    let commit, get, getters, barcodes, failedResponse, emptyResponse

    beforeEach(() => {
        commit = jest.fn()
        get = jest.fn()
        getters = { 'platesRequest': { 'get': get } }
        barcodes = ["DN1234567"]

        emptyResponse = { data: { data: [] }, status: 200, statusText: 'Success' }
        failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
    })

    it('successfully', async () => {
        get.mockReturnValue(Data.SequencescapePlates)

        let expectedResponse = new Response(Data.SequencescapePlates)
        let expectedPlates = expectedResponse.deserialize.plates

        let response = await Actions.getPlates({ commit, getters }, barcodes)

        expect(commit).toHaveBeenCalledWith("setPlates", expectedPlates)
        expect(response).toEqual(expectedResponse)
    })

    // it('unsuccessfully', async () => {
    //     get.mockReturnValue(failedResponse)

    //     let expectedResponse = new Response(failedResponse)

    //     let response = await Actions.getSampleExtractionTubesForBarcodes({ commit, getters }, barcodeList)

    //     expect(commit).not.toHaveBeenCalled()
    //     expect(response).toEqual(expectedResponse)
    // })

    // it('when no tubes exist', async () => {
    //     get.mockReturnValue(emptyResponse)

    //     let expectedResponse = new Response(emptyResponse)

    //     let response = await Actions.getSampleExtractionTubesForBarcodes({ commit, getters }, barcodeList)

    //     expect(commit).not.toHaveBeenCalled()
    //     expect(response).toEqual(expectedResponse)
    // })
})

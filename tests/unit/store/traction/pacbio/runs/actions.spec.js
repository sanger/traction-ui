import Response from '@/api/Response'
import * as Actions from '@/store/traction/saphyr/runs/actions'
import { Data } from '../../../../testHelper'

describe('#setRuns', () => {
  let commit, get, getters, failedResponse

  beforeEach(() => {
    commit = jest.fn()
    get = jest.fn()
    getters = { 'runRequest': { 'get': get } }

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    get.mockReturnValue(Data.PacbioRuns)

    let expectedResponse = new Response(Data.PacbioRuns)
    let expectedRuns = expectedResponse.deserialize.runs

    let response = await Actions.setRuns({ commit, getters })

    expect(commit).toHaveBeenCalledWith("setRuns", expectedRuns)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    let expectedResponse = new Response(failedResponse)

    let response = await Actions.setRuns({ commit, getters })

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })
})
import Response from '@/api/Response'
import * as Actions from '@/store/traction/pacbio/runs/actions'
import { Data } from '../../../../testHelper'
import * as Run from '@/api/PacbioRun'

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

describe('#newRun', () => {
  let commit

  beforeEach(() => {
    commit = jest.fn()
  })

  it('successfully', async () => {
    let newRun = Run.build()
    Run.build = jest.fn()
    Run.build.mockReturnValue(newRun)

    Actions.newRun({ commit })
    expect(commit).toHaveBeenCalledWith("setCurrentRun", newRun)
  })
})

describe('#createRun', () => {
  let getters, pacbioRequests, mockRun

  beforeEach(() => {
    mockRun = new Response(Data.PacbioRun).deserialize.runs[0]
    pacbioRequests = jest.fn()
    getters = { 'currentRun': mockRun, 'pacbioRequests': pacbioRequests }

    Run.create = jest.fn()
  })

  it('successfully', async () => {
    Actions.createRun({ getters })
    expect(Run.create).toHaveBeenCalledWith(mockRun, pacbioRequests)
  })
})

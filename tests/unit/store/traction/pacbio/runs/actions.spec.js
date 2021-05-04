import Response from '@/api/Response'
import * as Actions from '@/store/traction/pacbio/runs/actions'
import { Data } from '../../../../testHelper'
import * as Run from '@/api/PacbioRun'

describe('#setRuns', () => {
  let commit, get, getters, failedResponse

  beforeEach(() => {
    commit = jest.fn()
    get = jest.fn()
    getters = { runRequest: { get: get } }

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    get.mockReturnValue(Data.PacbioRuns)

    let expectedResponse = new Response(Data.PacbioRuns)
    let expectedRuns = expectedResponse.deserialize.runs

    let response = await Actions.setRuns({ commit, getters })

    expect(commit).toHaveBeenCalledWith('setRuns', expectedRuns)
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
    expect(commit).toHaveBeenCalledWith('setCurrentRun', newRun)
  })
})

describe('#createRun', () => {
  let getters, pacbioRequests, mockRun

  beforeEach(() => {
    mockRun = new Response(Data.PacbioRun).deserialize.runs[0]
    pacbioRequests = jest.fn()
    getters = { currentRun: mockRun, pacbioRequests: pacbioRequests }

    Run.create = jest.fn()
  })

  it('successfully', async () => {
    Actions.createRun({ getters })
    expect(Run.create).toHaveBeenCalledWith(mockRun, pacbioRequests)
  })
})

describe('#editRun', () => {
  let getters, commit, mockRun, find

  beforeEach(() => {
    mockRun = new Response(Data.PacbioRun).deserialize.runs[0]

    find = jest.fn()
    getters = { runRequest: { find: find } }
    commit = jest.fn()
  })

  it('successfully', async () => {
    find.mockReturnValue(Data.PacbioRun)
    await Actions.editRun({ commit, getters }, mockRun.id)
    expect(commit).toHaveBeenCalled() //("setCurrentRun", mockRun)
  })
})

describe('#updateRun', () => {
  let getters, pacbioRequests, mockRun, dispatch

  beforeEach(() => {
    mockRun = new Response(Data.PacbioRun).deserialize.runs[0]
    pacbioRequests = jest.fn()
    getters = { currentRun: mockRun, pacbioRequests: pacbioRequests }
    dispatch = jest.fn()

    Run.update = jest.fn()
  })

  it('when successful, it doesnt rollback', async () => {
    Run.update.mockReturnValue([])
    let resp = await Actions.updateRun({ getters, dispatch })

    expect(Run.update).toHaveBeenCalledWith(mockRun, pacbioRequests)
    expect(Run.update).toHaveBeenCalledTimes(1)
    expect(resp).toEqual([])
  })

  it('when unsuccessful, it does rollback', async () => {
    Run.update.mockReturnValue([{ error: 'this is an error' }])
    let resp = await Actions.updateRun({ getters, dispatch })

    expect(Run.update).toHaveBeenCalledWith(mockRun, pacbioRequests)
    expect(Run.update).toHaveBeenCalledTimes(2)
    expect(resp).toEqual([{ error: 'this is an error' }])
  })
})

describe('#getRun', () => {
  let find, getters

  beforeEach(() => {
    find = jest.fn()
    getters = { runRequest: { find: find } }
  })

  it('successfully', async () => {
    find.mockReturnValue(Data.PacbioRun)

    let expectedResponse = new Response(Data.PacbioRun)
    let expectedRun = expectedResponse.deserialize.runs[0]

    let response = await Actions.getRun({ getters })

    expect(response).toEqual(expectedRun)
  })
})

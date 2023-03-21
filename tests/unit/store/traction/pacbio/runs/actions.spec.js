import * as Actions from '@/store/traction/pacbio/runs/actions'
import { Data } from '@support/testHelper'
import { expect, vi } from 'vitest'
import { newResponse } from '@/api/ResponseHelper'

describe('#fetchPacbioRuns', () => {
  let commit, get, getters, failedResponse

  beforeEach(() => {
    commit = vi.fn()
    get = vi.fn()
    getters = { runRequest: { get: get } }

    failedResponse = {
      data: { data: { errors: { error1: ['There was an error'] } } },
      status: 500,
      statusText: 'Internal Server Error',
    }
  })

  it('successfully', async () => {
    get.mockReturnValue(Data.PacbioRuns)

    const { success, errors } = await Actions.fetchPacbioRuns({ commit, getters })

    expect(commit).toHaveBeenCalledWith('setRuns', Data.PacbioRuns.data.data)
    expect(success).toEqual(true)
    expect(errors).toEqual([])
  })

  it('unsuccessfully', async () => {
    get.mockRejectedValue({ response: failedResponse })
    const expectedResponse = newResponse({ ...failedResponse, success: false })

    const { success, errors } = await Actions.fetchPacbioRuns({ commit, getters })

    expect(commit).not.toHaveBeenCalled()
    expect(success).toEqual(false)
    expect(errors).toEqual(expectedResponse.errors)
  })
})

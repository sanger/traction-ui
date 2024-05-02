import Response from '@/api/v1/Response'
import * as Actions from '@/store/traction/actions'
import { Data } from '@support/testHelper'

describe('#setTags', () => {
  let commit, get, getters, failedResponse

  beforeEach(() => {
    commit = vi.fn()
    get = vi.fn()
    getters = { tagsRequest: { get: get } }

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    get.mockReturnValue(Data.TractionTags)

    const expectedResponse = new Response(Data.TractionTags)
    const expectedTags = expectedResponse.deserialize.tags

    const response = await Actions.setTags({ getters, commit })

    expect(commit).toHaveBeenCalledWith('setTags', expectedTags)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    const expectedResponse = new Response(failedResponse)

    const response = await Actions.setTags({ getters, commit })

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })
})

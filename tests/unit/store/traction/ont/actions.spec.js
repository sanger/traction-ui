import actions from '@/store/traction/ont/actions'
import { Data } from '@support/testHelper'
import Contracts from './contracts'

describe('fetchOntRequests', () => {
  it('handles success', async () => {
    // mock commit
    const commit = vi.fn()
    // mock dependencies
    const get = vi.fn()
    const rootState = { api: { traction: { ont: { requests: { get } } } } }
    get.mockResolvedValue(Data.TractionOntRequests)
    // apply action
    const { success } = await actions.fetchOntRequests({ commit, rootState })
    // assert result (Might make sense to pull these into separate tests)
    expect(commit).toHaveBeenCalledWith(
      'populateRequests',
      Contracts.requests.populateRequestsParameters,
    )
    expect(success).toEqual(true)
  })

  it('handles failure', async () => {
    // mock commit
    const commit = vi.fn()
    // mock dependencies
    const get = vi.fn()
    const rootState = { api: { traction: { ont: { requests: { get } } } } }
    get.mockRejectedValue({
      data: { data: [] },
      status: 500,
      statusText: 'Internal Server Error',
    })
    // apply action
    const { success } = await actions.fetchOntRequests({ commit, rootState })
    // assert result (Might make sense to pull these into separate tests)
    expect(commit).not.toHaveBeenCalled()
    expect(success).toEqual(false)
  })
})

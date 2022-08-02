import mutations from '@/store/traction/ont/mutations'
import defaultState from '@/store/traction/ont/state'
import Contracts from './contracts'

describe('populateRequests', () => {
  it('updates the state', () => {
    // mock state
    const requests = Contracts.requests.populateRequestsParameters
    const state = defaultState()
    // apply mutation
    mutations.populateRequests(state, requests)
    // assert result
    expect(state.resources.requests).toEqual(Contracts.requests.storeData)
  })
})

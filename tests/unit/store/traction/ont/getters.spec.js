import getters from '@/store/traction/ont/getters'
import defaultState from '@/store/traction/ont/state'
import merge from 'lodash-es/merge'
import Contracts from './contracts'

const state = () =>
  merge(defaultState(), {
    resources: {
      requests: Contracts.requests.storeData,
    },
  })

describe('requests', () => {
  it('returns a list of requests', () => {
    expect(getters.requests(state())).toEqual(Contracts.requests.getterRequestReturn)
  })
})

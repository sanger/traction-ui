import Response from '@/api/Response'
import { Data } from 'testHelper'
import getters from '@/store/traction/getters'

let tractionTags

describe('getters', () => {
  beforeEach(() => {
    tractionTags = new Response(Data.TractionTags).deserialize.tags
  })

  it('"tractionTags" returns "state.tractionTags"', () => {
    const state = {
      tractionTags: tractionTags,
    }
    expect(getters.tractionTags(state)).toBe(tractionTags)
  })
})

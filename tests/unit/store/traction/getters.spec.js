import Response from '@/api/v1/Response'
import { Data } from '@support/testHelper'
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

  describe('messages', () => {
    const messages = [{ type: 'alert', message: 'Something went wrong' }]

    it('returns the messages', () => {
      const state = { messages }
      expect(getters.messages(state)).toBe(messages)
    })
  })
})

import Response from '@/api/v1/Response'
import { Data } from '@support/testHelper'
import mutations from '@/store/traction/mutations'
import { expect } from 'vitest'

let tractionTags

describe('setTags', () => {
  beforeEach(() => {
    tractionTags = new Response(Data.TractionTags).deserialize.tractionTags
  })

  it('"setTags" sets "state.tractionTags" to the given tags', () => {
    const state = {
      tractionTags: [],
    }
    mutations.setTags(state, tractionTags)
    expect(state.tractionTags).toEqual(tractionTags)
  })
})

describe('addMessage', () => {
  it('adds a message', () => {
    const state = { messages: { 1: { type: 'Alert', message: 'Existing' } } }

    mutations.addMessage(state, { type: 'info', message: 'New message' })

    expect(Object.values(state.messages)).toEqual([
      { type: 'Alert', message: 'Existing' },
      { type: 'info', message: 'New message' },
    ])
  })
})

describe('clearMessages', () => {
  beforeEach(() => {
    tractionTags = new Response(Data.TractionTags).deserialize.tractionTags
  })

  it('clears all messages but keeps tractionTags', () => {
    const state = {
      messages: {
        1: { type: 'Alert', message: 'Existing' },
        2: { type: 'Alert', message: 'Message' },
        3: { type: 'Alert', message: 'Another Message' },
      },
      tractionTags,
    }

    mutations.clearMessages(state)

    expect(state.messages).toEqual({})
    expect(state.tractionTags).toEqual(tractionTags)
  })
})

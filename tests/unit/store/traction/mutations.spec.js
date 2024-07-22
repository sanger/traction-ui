import mutations from '@/store/traction/mutations'
import { expect } from 'vitest'

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
  it('clears all messages', () => {
    const state = {
      messages: {
        1: { type: 'Alert', message: 'Existing' },
        2: { type: 'Alert', message: 'Message' },
        3: { type: 'Alert', message: 'Another Message' },
      },
    }

    mutations.clearMessages(state)

    expect(state.messages).toEqual({})
  })
})

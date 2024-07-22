import getters from '@/store/traction/getters'

describe('getters', () => {
  describe('messages', () => {
    const messages = [{ type: 'alert', message: 'Something went wrong' }]

    it('returns the messages', () => {
      const state = { messages }
      expect(getters.messages(state)).toBe(messages)
    })
  })
})

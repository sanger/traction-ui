import useAlert from '@/composables/useAlert.js'
import store from '@/store'

describe('#useAlert', () => {
  it('commits addMessage on show Alert call', () => {
    const mockCommit = vi.fn().mockResolvedValue({})
    store.commit = mockCommit
    const { showAlert } = useAlert()
    showAlert('show this message', 'success')
    // TODO: [Vue warn]: inject() can only be used inside setup() or functional components.
    expect(mockCommit).toHaveBeenCalledWith('traction/addMessage', {
      type: 'success',
      message: 'show this message',
      dataType: undefined,
      origin: 'undefined - ',
      time: expect.any(String),
    })
  })
})

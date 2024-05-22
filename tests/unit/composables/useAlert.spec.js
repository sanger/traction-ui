import useAlert from '@/composables/useAlert.js'
import store from '@/store'
import { createPinia, setActivePinia } from 'pinia'

describe('#useAlert', () => {
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
    up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })
  it('commits addMessage on show Alert call', () => {
    const mockCommit = vi.fn().mockResolvedValue({})
    store.commit = mockCommit
    const { showAlert } = useAlert()
    showAlert('show this message', 'success')
    expect(mockCommit).toHaveBeenCalledWith('traction/addMessage', {
      type: 'success',
      message: 'show this message',
      dataType: undefined,
      origin: 'undefined - ',
      time: expect.any(String),
    })
  })
})

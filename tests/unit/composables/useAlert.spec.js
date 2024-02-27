import useAlert from '@/composables/useAlert.js'
import useRootStore from '@/stores'
import { createPinia, setActivePinia } from 'pinia'

describe('#useAlert', () => {
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
    up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })
  it('commits addMessage on show Alert call', () => {
    const store = useRootStore()
    store.addMessage = vi.fn().mockResolvedValue({})
    const { showAlert } = useAlert()
    showAlert('show this message', 'success')
    expect(store.addMessage).toHaveBeenCalledWith({
      type: 'success',
      message: 'show this message',
      dataType: undefined,
    })
  })
})

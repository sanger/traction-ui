import useAlert from '@/composables/useAlert.js'
import useRootStore from '@/stores'
import { useRouter } from 'vue-router'

// we need to mock the vue-router to avoid the following warning:
// [Vue warn]: inject() can only be used inside setup() or functional components.
vi.mock('vue-router')

describe('#useAlert', () => {
  useRouter.mockReturnValue({
    push: vi.fn(),
  })

  beforeEach(() => {
    useRouter().push.mockReset()
  })

  it('commits addMessage on show Alert call', () => {
    const rootStore = useRootStore()
    const { showAlert } = useAlert()
    showAlert('show this message', 'success')
    expect(rootStore.messages).toEqual({
      1: {
        type: 'success',
        message: 'show this message',
        dataType: undefined,
        origin: 'undefined - ',
        time: expect.any(String),
      },
    })
  })
})

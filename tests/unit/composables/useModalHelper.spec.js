import useModalHelper from '@/composables/useModalHelper.js'

const modalRef = {
  hide: vi.fn(),
}
describe('#useModalHelper', () => {
  it('calls hide method on hide function call', () => {
    useModalHelper(modalRef).hide()
    expect(modalRef.hide).toHaveBeenCalled()
  })
})

/**
 * A composable function that provides a method to hide a modal.
 * @returns {Function} .hide A method that hides the modal.
 */
export default function useModalHelper(modalRef) {
  /**
   * Hides the modal.
   */
  const hide = () => {
    //Hides the modal referenced by modalRef
    if (modalRef) {
      modalRef.hide()
    }
  }

  return {
    hide,
  }
}

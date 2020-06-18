/**
 * A mixin to store common functionality for ONT Run draggable components
 */
export default {
  name: 'DragHelper',
  data() {
    return {
      hover: false
    }
  },
  methods: {
    allowDrop(event) {
      event.preventDefault()
      this.hover = true
    },
    endDrop(event) {
      event.preventDefault()
      this.hover = false
    },
    // Update the flowcell with the new library name
    // Update the cached library list, by updating the library.assignedToFlowcell
    handleDropUpdate(flowcellPosition, libraryName, assignedToFlowcell) {
      this.$emit('updateFlowcell', flowcellPosition, libraryName)
      this.$emit('updateLibraryList', libraryName, assignedToFlowcell)
      this.hover = false
    }
  }
}

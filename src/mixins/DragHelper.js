/**
 * A mixin to store common functionality for ONT Run draggable components
 */
export default {
  name: 'DragHelper',
  emits: ['updateFlowcell', 'updateLibraryList'],
  data() {
    return {
      hover: false,
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
    updateFlowcell(flowcellPosition, libraryName) {
      this.$emit('updateFlowcell', flowcellPosition, libraryName)
    },
    // Update the cached library list, by updating the library.assignedToFlowcell
    updateLibraryList(libraryName, assignedToFlowcell) {
      this.$emit('updateLibraryList', libraryName, assignedToFlowcell)
    },
  },
}

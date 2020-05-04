/**
 * A helper mixin to store commonly used functionality for modals
 */

export default {
  name: 'ModalHelper',
  methods: {
    hide() {
      this.$refs['modal'].hide()
    },
  }
}

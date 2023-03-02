<template>
  <div>
    <traction-alert
      :variant="variant"
      :data-type="dataType"
      dismissible
      show
      @dismissed="dismiss()"
      >{{ message }}</traction-alert
    >
  </div>
</template>

<script>
export default {
  name: 'TractionMessage',
  props: {
    dataType: {
      // Used primarily by the e2e tests to identify the correct error message
      type: String,
      default() {
        return 'error-message'
      },
    },
    type: {
      type: String,
      default: 'primary',
    },
    message: {
      type: String,
      required: true,
    },
  },
  computed: {
    variant() {
      return (
        {
          error: 'danger',
        }[this.type] || this.type
      )
    },
  },
  methods: {
    dismiss() {
      this.$emit('dismissed')
    },
  },
}
</script>

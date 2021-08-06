<template>
  <div>
    <b-alert
      id="showAlert"
      :variant="type"
      data-type="error-message"
      dismissible
      :show="showDismissibleAlert"
      @dismissed="showDismissibleAlert = false"
    >
      {{ message }}
    </b-alert>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  data() {
    return {
      message: '',
      type: '',
      showDismissibleAlert: false,
    }
  },
  methods: {
    show(message, type = 'primary') {
      this.message = message
      this.type = type
      this.showDismissibleAlert = true
    },
  },
}
</script>

<template>
  <div>
    <b-alert
      id="showAlert"
      :variant="type"
      :data-type="dataType"
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
  props: {
    dataType: {
      type: String,
      default() {
        return 'error-message'
      },
    },
  },
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

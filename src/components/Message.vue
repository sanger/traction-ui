<template>
  <div>
    <b-alert :variant="type" :data-type="dataType" dismissible show @dismissed="dismiss">
      {{ message }}
    </b-alert>
  </div>
</template>

<script>
export default {
  name: 'Message',
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
  methods: {
    dismiss() {},
  },
}
</script>

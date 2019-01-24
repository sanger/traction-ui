export default {
  name: 'ConfigItem',
  props: {
    name: {
      type: String,
      required: true
    },
    apiNamespace: {
      type: String,
      required: true
    }
  },
  computed: {
    baseURL () {
      return process.env[`VUE_APP_${this.name.toUpperCase()}_BASE_URL`]
    }
  }
}
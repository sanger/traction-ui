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
    },
    resources: {
      type: Object,
      default: () => { return {} }
    }
  },
  computed: {
    baseURL () {
      return process.env[`VUE_APP_${this.name.toUpperCase()}_BASE_URL`]
    }
  },
  methods: {
    resource(name) {
      let res = this.resources[name]
      return {
        baseURL: this.baseURL,
        apiNamespace: this.apiNamespace,
        resource: res.name,
        filter: res.filter,
        include: res.include
      }
    }
  }
}

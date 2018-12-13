
import axios from 'axios'

export default {
  name: 'Query',
  props: {
    baseURL: {
    type: String,
    default: 'http://example.com'
    },
    apiNamespace: {
      type: String,
      default: 'api/v1'
    },
    resource: {
      type: String,
      required: true
    },
    headers: {
      type: Object,
      default: () => {
        return { 
          'Content-Type': 'application/vnd.api+json', 
          'Accept': 'application/vnd.api+json'
        }
      }
    }
  },
  computed: {
    rootURL () {
      return `${this.baseURL}/${this.apiNamespace}`
    }
  },
  methods: {
    async execute(type, ...params) {

      if (this.loading) return

      this.loading = true

      await this.api[type](...params)
        .then(response => {
          this.data = response.data
          this.errors = null
        })
        .catch(response => {
          this.data = null
          this.errors = response.data.errors
        })
        
      this.loading = false
    }
  },
  data () {
    return {
      api:  {},
      data: null,
      errors: null,
      loading: false
    }
  },
  created () {
    this.api = axios.create({ baseURL: this.rootURL, headers: this.headers })
  }
}
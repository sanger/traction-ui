
import axios from 'axios'
import Response from '@/api/Response'

export default {
  name: 'Query',
  props: {
    baseURL: {
    type: String,
    default: 'http://localhost:3000'
    },
    apiNamespace: {
      type: String,
      default: 'api/v2'
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
  data () {
    return {
      api:  {},
      data: null,
      errors: null,
      loading: false
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
          this.data = new Response(response)
          this.errors = null
        })
        .catch(response => {
          this.data = null
          this.errors = new Response(response).errors
        })

      this.loading = false
    }
  },
  created () {
    this.api = axios.create({ baseURL: this.rootURL, headers: this.headers })
  }
}

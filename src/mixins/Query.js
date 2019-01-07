import axios from 'axios'
import Response from '@/api/Response'

export default {
  name: 'Query',
  props: {
    baseURL: {
      type: String,
      required: true
    },
    apiNamespace: {
      type: String,
      required: true
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
      let resp
      try {
        resp = await this.api[type](...params)
        let response = new Response(resp)
        this.data = response
        this.errors = null
        this.$emit('myevent', response)
      } catch(resp) {
        // resp.response includes errors
        let response = new Response(resp)
        this.data = null
        this.errors = response.errors
        this.$emit('myevent', response)
      }
      this.loading = false
    }
  },
  created () {
    this.api = axios.create({ baseURL: this.rootURL, headers: this.headers })
  }
}

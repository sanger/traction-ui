
import axios from 'axios'

export default {
  props: {
    name: 'DataList',
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
    },
    filters: {
      type: Object,
      default: () => {
        return { }
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
    },
    endpoint () {
      if (Object.keys(this.filters).length === 0) {
        return this.resource
      }
      
      let mappedFilters = Object.keys(this.filters).map(key => `filter[${key}]=${this.filters[key]}`)
      return `${this.resource}?${mappedFilters.join('&')}`
    }
  },
  methods: {
    async query(type, ...params) {

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
    },
    load () {
      return this.query('get', this.endpoint)
    }
  },
  render () {

  },
  created () {
    this.api = axios.create({ baseURL: this.rootURL, headers: this.headers })
  }
}
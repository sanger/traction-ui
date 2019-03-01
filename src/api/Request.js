/*
TODO:
  - implement update and destroy as higher order functions and
    turn into map ( problem with what is returned for multiple, only seem to get first response)
  - implement url for each call as method
*/

import axios from 'axios'

export default {
  name: 'Request',
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
    },
    filter: {
      type: Object,
      default: () => {
        return { }
      }
    },
    include: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      api:  {},
      loading: false
    }
  },
  computed: {
    rootURL () {
      return `${this.baseURL}/${this.apiNamespace}`
    },
    query () {
      if (Object.keys(this.filter).length === 0 && this.include.length === 0) return ''

      let query = '?'

      if (Object.keys(this.filter).length > 0) {
        query += Object.keys(this.filter).map(key => `filter[${key}]=${this.filter[key]}`).join('&')
      }

      if (this.include.length > 0) {
        if (Object.keys(this.filter).length > 0) {
          query += '&'
        }
        query += `include=${this.include}`
      }

      return query
    }
  },
  methods: {
    async execute(type, ...params) {
      if (this.loading) return
      this.loading = true
      let response
      try {
        response = await this.api[type](...params)
      } catch(resp) {
        response = resp
      }
      this.loading = false
      return response
    },
    buildQuery(parameters = [], values = {}) {
      let queryString = parameters.map(parameter => {
        let queryObject = values[parameter] || this[parameter]
        if (this.isObject(queryObject)) {
          return Object.keys(queryObject).map(key => `${parameter}[${key}]=${queryObject[key]}`).join('&')
        }
        if (typeof(queryObject) === 'string' && queryObject.length > 0) {
          return `${parameter}=${queryObject}`
        }
      }).filter(Boolean).join('&')
      return (queryString ? `?${queryString}` : '')
    },
    isObject (value) {
      return value && typeof value === 'object' && value.constructor === Object
    },
    get (queryParameters = {}) {
      return this.execute('get', `${this.resource}${this.buildQuery(['filter','include'], queryParameters)}`)
    },
    find (id) {
      return this.execute('get', `${this.resource}/${id}${this.query}`)
    },
    create (data) {
      return this.execute('post', this.resource, data)
    },
    async update (data) {
      let response = []
      for (let item of (Array.isArray(data) ? data : [data])) {
        response.push(await this.execute('patch', `${this.resource}/${item.data.id}`, item))
      }
      return response
    },
    async destroy (ids) {
      let response = []
      for (let item of (Array.isArray(ids) ? ids : [ids])) {
        response.push(await this.execute('delete', `${this.resource}/${item}`))
      }
      return response
    }
  },
  created () {
    this.api = axios.create({ baseURL: this.rootURL, headers: this.headers })
  }
}

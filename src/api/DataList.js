import Query from '@/mixins/Query'

export default {
  name: 'DataList',
  mixins: [Query],
  props: {
    filters: {
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
  computed: {
    query () {
      if (Object.keys(this.filters).length === 0 && this.include.length === 0) return ''

      let query = '?'

      if (Object.keys(this.filters).length > 0) {
        query += Object.keys(this.filters).map(key => `filter[${key}]=${this.filters[key]}`).join('&')
      }

      if (this.include.length > 0) {
        query += `&include=${this.include}`
      }

      return query

    },
    endpoint () {
      return this.resource.concat(this.query)
    }
  },
  methods: {
    load () {
      return this.execute('get', this.endpoint)
    },
    getDataBody () {
      if (this.data) return this.data.body
      return []
    }
  },
  render () {
    if (this.$scopedSlots.default === undefined) return
    return this.$scopedSlots.default({
      data: this.getDataBody(),
      errors: this.errors,
      load: this.load,
      loading: this.loading
    })
  },
  created () {
    if ((this.data === null) && (this.errors === null)) this.load()
  }
}

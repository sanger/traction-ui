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
    }
  },
  computed: {
    endpoint () {
      if (Object.keys(this.filters).length === 0) return this.resource

      let mappedFilters = Object.keys(this.filters).map(key => `filter[${key}]=${this.filters[key]}`)
      return `${this.resource}?${mappedFilters.join('&')}`
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
      // data: this.data,
      errors: this.errors,
      load: this.load,
      loading: this.loading
    })
  },
  created () {
    // only load if data doesnt already exist
    // TODO: sort out null checks
    // undefined works for tests
    // null works for running
    // if ((this.data === undefined) || (this.errors === undefined)) this.load()
    if ((this.data === null) || (this.errors === null)) this.load()
  }
}

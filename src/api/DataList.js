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
    load() {
      return this.execute('get', this.endpoint)
    }
  },
  render() {
    if (this.$scopedSlots.default === undefined) return
    return this.$scopedSlots.default({
      data: this.data,
      errors: this.errors,
      load: this.load,
      loading: this.loading,
    })
  }
}

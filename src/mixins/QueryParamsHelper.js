/**
 * A mixin to store commonly used functionality for handling router query params
 */

export default {
  name: 'QueryParamsHelper',
  methods: {
    async updateRouter(values = {}) {
      const router_query = { ...this.$route.query, ...values }
      await this.$router.push({ query: router_query })
    },
    async clearFilter() {
      const router_query = { ...this.$route.query }
      delete router_query['filter_value']
      delete router_query['filter_input']
      delete router_query['filter_wildcard']
      await this.$router.push({ query: router_query })
    },
  },
  computed: {
    filter_value: {
      get() {
        return this.$route.query.filter_value
      },
      async set(value) {
        await this.updateRouter({ filter_value: value })
      },
    },
    filter_input: {
      get() {
        return this.$route.query.filter_input
      },
      async set(value) {
        await this.updateRouter({ filter_input: value })
      },
    },
    filter_wildcard: {
      get() {
        return this.$route.query.filter_wildcard
      },
      async set(value) {
        await this.updateRouter({ filter_wildcard: value })
      },
    },
    page_size: {
      get() {
        return Number(this.$route.query.page_size)
      },
      async set(value) {
        await this.updateRouter({ page_size: value })
      },
    },
    page_number: {
      get() {
        return Number(this.$route.query.page_number)
      },
      async set(value) {
        await this.updateRouter({ page_number: value })
      },
    },
  },
}

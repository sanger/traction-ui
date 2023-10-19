import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default function useQueryParams() {
  const route = useRoute()
  const router = useRouter()

  async function updateRouter(values = {}) {
    const router_query = { ...route.query, ...values }
    await router.push({ query: router_query })
  }

  async function clearFilter() {
    // We want to return to the first page if the filter is cleared
    const router_query = { ...route.query, page_number: 1 }
    delete router_query['filter_value']
    delete router_query['filter_input']
    delete router_query['filter_wildcard']
    await router.push({ query: router_query })
  }

  const filter_value = computed({
    get() {
      return route.query.filter_value
    },
    async set(value) {
      await updateRouter({ filter_value: value })
    },
  })
  const filter_input = computed({
    get() {
      return route.query.filter_input
    },
    async set(value) {
      await updateRouter({ filter_input: value })
    },
  })
  const filter_wildcard = computed({
    get() {
      return route.query.filter_wildcard
    },
    async set(value) {
      await updateRouter({ filter_wildcard: value })
    },
  })
  const page_size = computed({
    get() {
      return Number(route.query.page_size) || 25
    },
    async set(value) {
      await updateRouter({ page_size: value })
    },
  })
  const page_number = computed({
    get() {
      return Number(route.query.page_number) || 1
    },
    async set(value) {
      await updateRouter({ page_number: value })
    },
  })

  return {
    filter_value,
    filter_input,
    filter_wildcard,
    page_size,
    page_number,
    clearFilter,
    updateRouter,
  }
}
